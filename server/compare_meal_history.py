#!/usr/bin/env python3
import os
import sys
import argparse
from dataclasses import dataclass
from datetime import datetime, timedelta, date
from typing import Optional, List, Dict, Any, Iterable

from pymongo import MongoClient, DESCENDING
from pymongo.errors import ConnectionFailure
from bson import ObjectId

# Reuse defaults from your existing fetcher
from fetch_meal_history import (
    parse_dt,               # same date parser you already use
    pick_meal_collection,   # same collection picker
    build_time_filter,      # same time filter builder
    DEFAULT_URI as FETCH_DEFAULT_URI,
    DEFAULT_DB  as FETCH_DEFAULT_DB,
)

# Separate defaults for goals (but we’ll default to your fetcher’s for consistency)
DEFAULT_URI = os.getenv("MONGODB_URI", FETCH_DEFAULT_URI)
DEFAULT_DB  = os.getenv("DB_NAME", FETCH_DEFAULT_DB)
DEFAULT_GOALS_COLLECTION = os.getenv("GOALS_COLLECTION", "goals")

def daterange(start_date: date, end_date: date) -> Iterable[date]:
    for i in range((end_date - start_date).days + 1):
        yield start_date + timedelta(days=i)

def _coalesce(d: Dict[str, Any], *keys, default=None):
    for k in keys:
        if isinstance(k, (list, tuple)):
            cur = d
            ok = True
            for part in k:
                if isinstance(cur, dict) and part in cur:
                    cur = cur[part]
                else:
                    ok = False
                    break
            if ok and cur is not None:
                return cur
        else:
            if k in d and d[k] is not None:
                return d[k]
    return default

def _to_float(x) -> float:
    try:
        return float(x)
    except Exception:
        return 0.0

def normalize_meal(doc: Dict[str, Any], created_field: str) -> Dict[str, Any]:
    ts = _coalesce(doc, created_field, "timestamp", "date")
    if isinstance(ts, str):
        try:
            ts = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        except Exception:
            ts = None

    name = _coalesce(doc, "name", "title", "meal", "item")

    calories   = _coalesce(doc, "calories", ["nutrition", "calories"], default=0)
    protein_g  = _coalesce(doc, "protein_g", "protein", ["nutrition", "protein_g"], default=0)
    carbs_g    = _coalesce(doc, "carbs_g", "carbs", "carbohydrates_g", ["nutrition", "carbs_g"], default=0)
    fat_g      = _coalesce(doc, "fat_g", "fat", ["nutrition", "fat_g"], default=0)
    sugar_g    = _coalesce(doc, "sugar_g", "sugar", ["nutrition", "sugar_g"], default=0)
    sodium_mg  = _coalesce(doc, "sodium_mg", "sodium", ["nutrition", "sodium_mg"], default=0)

    return {
        "timestamp": ts,
        "name": name,
        "calories": _to_float(calories),
        "protein_g": _to_float(protein_g),
        "carbs_g": _to_float(carbs_g),
        "fat_g": _to_float(fat_g),
        "sugar_g": _to_float(sugar_g),
        "sodium_mg": _to_float(sodium_mg),
        "_raw": doc,
    }

@dataclass
class DailyGoals:
    calories: Optional[float] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    sugar_g_max: Optional[float] = None
    sodium_mg_max: Optional[float] = None

@dataclass
class DayTotals:
    calories: float = 0.0
    protein_g: float = 0.0
    carbs_g: float = 0.0
    fat_g: float = 0.0
    sugar_g: float = 0.0
    sodium_mg: float = 0.0

    def add_meal(self, meal: Dict[str, Any]) -> None:
        self.calories += float(meal.get("calories", 0) or 0)
        self.protein_g += float(meal.get("protein_g", 0) or 0)
        self.carbs_g += float(meal.get("carbs_g", 0) or 0)
        self.fat_g += float(meal.get("fat_g", 0) or 0)
        self.sugar_g += float(meal.get("sugar_g", 0) or 0)
        self.sodium_mg += float(meal.get("sodium_mg", 0) or 0)

def fetch_goals(client: MongoClient, db_name: str, collection: str, user_id: str) -> DailyGoals:
    doc = client[db_name][collection].find_one({"user_id": user_id})
    if not doc:
        raise SystemExit(f"No goals found for user_id={user_id!r} in {db_name}.{collection}")
    g = (doc.get("daily_goals") or {})
    return DailyGoals(
        calories=g.get("calories"),
        protein_g=g.get("protein_g"),
        carbs_g=g.get("carbs_g"),
        fat_g=g.get("fat_g"),
        sugar_g_max=g.get("sugar_g_max"),
        sodium_mg_max=g.get("sodium_mg_max"),
    )

def compare_to_goals(day_totals: DayTotals, goals: DailyGoals) -> Dict[str, Dict[str, Optional[float]]]:
    out: Dict[str, Dict[str, Optional[float]]] = {}

    def assess(actual: Optional[float], goal: Optional[float], max_is_limit: bool = False):
        if actual is None or goal is None:
            return actual, goal, None, None
        delta = actual - goal
        if max_is_limit:
            status = "within" if actual <= goal else "over"
        else:
            tol = 0.05 * goal if goal else 0
            if abs(delta) <= tol:
                status = "within"
            elif actual > goal:
                status = "over"
            else:
                status = "under"
        return actual, goal, delta, status

    metrics = [
        ("calories", False),
        ("protein_g", False),
        ("carbs_g", False),
        ("fat_g", False),
        ("sugar_g", True),
        ("sodium_mg", True),
    ]
    for m, is_limit in metrics:
        a, g, d, s = assess(
            getattr(day_totals, m),
            getattr(goals, m if not is_limit else f"{m}_max", None),
            is_limit,
        )
        out[m] = {"actual": a, "goal": g, "delta": d, "status": s}
    return out

def render_day_report(day: date, cmp: Dict[str, Dict[str, Optional[float]]]) -> str:
    def fmt(v: Optional[float]) -> str:
        return "-" if v is None else f"{v:.0f}"
    lines = [f"# {day.isoformat()}"]
    for k in ["calories", "protein_g", "carbs_g", "fat_g", "sugar_g", "sodium_mg"]:
        row = cmp[k]
        status = row.get("status") or "n/a"
        lines.append(
            f"- {k:11s} | actual: {fmt(row['actual'])}  goal: {fmt(row['goal'])}  "
            f"delta: {fmt(row['delta'])}  status: {status}"
        )
    return "\n".join(lines)

def print_summary(all_cmp: Dict[date, Dict[str, Dict[str, Optional[float]]]]) -> None:
    metrics = ["calories", "protein_g", "carbs_g", "fat_g", "sugar_g", "sodium_mg"]
    tally = {m: {"within": 0, "over": 0, "under": 0, "n/a": 0} for m in metrics}
    for _d, cmp in all_cmp.items():
        for m in metrics:
            s = (cmp.get(m) or {}).get("status") or "n/a"
            tally[m][s] = tally[m].get(s, 0) + 1
    print("\n== Summary across period ==")
    for m in metrics:
        t = tally[m]
        print(f"{m:11s} | within: {t['within']:2d}  over: {t['over']:2d}  under: {t['under']:2d}  n/a: {t['n/a']:2d}")

def main():
    ap = argparse.ArgumentParser(description="Compare meal history to dieting goals (imports helpers from fetch_meal_history.py).")
    ap.add_argument("--uri", default=DEFAULT_URI, help="MongoDB URI (default: env MONGODB_URI or your fetcher default)")
    ap.add_argument("--db", default=DEFAULT_DB, help="Database name (default: env DB_NAME or your fetcher default)")
    ap.add_argument("--collection", default=os.getenv("MEAL_COLLECTION", ""), help="Explicit meal collection name (overrides auto-detect)")
    ap.add_argument("--goals-collection", default=DEFAULT_GOALS_COLLECTION, help="Goals collection name (default: env GOALS_COLLECTION or 'goals')")

    ap.add_argument("--user-id", required=True, help="Filter by user id (same semantics as fetcher).")
    ap.add_argument("--user-field", default=os.getenv("USER_FIELD", "userId"), help="User id field in meal docs (default: userId)")
    ap.add_argument("--created-field", default=os.getenv("CREATED_FIELD", "createdAt"), help="Timestamp field in meal docs (default: createdAt)")

    ap.add_argument("--start", type=parse_dt, help="Start datetime (e.g., 2025-10-01 or 2025-10-01T00:00)")
    ap.add_argument("--end", type=parse_dt, help="End datetime (e.g., 2025-10-27 or 2025-10-27T23:59)")
    ap.add_argument("--limit", type=int, default=1000, help="Max docs to scan (default: 1000)")
    args = ap.parse_args()

    # Connect to Mongo
    try:
        client = MongoClient(args.uri, serverSelectionTimeoutMS=5000, tz_aware=True)
        client.admin.command("ping")
    except ConnectionFailure as e:
        print(f"ERROR: Could not connect to MongoDB at {args.uri}: {e}", file=sys.stderr)
        sys.exit(1)

    db = client[args.db]

    # Pick meal collection using your helper
    try:
        coll_name = pick_meal_collection(db, args.collection or None)
    except RuntimeError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(2)

    coll = db[coll_name]

    # Build query using your helper
    query: Dict[str, Any] = {}
    if args.user_id:
        ors = [{args.user_field: args.user_id}]
        if ObjectId.is_valid(args.user_id):
            ors.append({args.user_field: ObjectId(args.user_id)})
        query["$or"] = ors

    time_filter = build_time_filter(args.created_field, args.start, args.end)
    if time_filter:
        query.update(time_filter)

    # Sort field consistent with your fetcher style
    sort_field = args.created_field if coll.find_one({args.created_field: {"$exists": True}}) else "_id"

    # Fetch docs, normalize, and bucket per day
    docs = list(coll.find(query).sort(sort_field, DESCENDING).limit(args.limit))
    meals = [normalize_meal(d, args.created_field) for d in docs]

    # Determine reporting range
    start_date = (args.start.date() if args.start else None)
    end_date = (args.end.date() if args.end else None)
    if not start_date or not end_date:
        timestamps = [m["timestamp"].date() for m in meals if isinstance(m.get("timestamp"), datetime)]
        if not timestamps:
            print("No timestamps found in meals and no explicit start/end provided.", file=sys.stderr)
            sys.exit(3)
        if not start_date:
            start_date = min(timestamps)
        if not end_date:
            end_date = max(timestamps)

    by_day: Dict[date, DayTotals] = {}
    for m in meals:
        ts = m.get("timestamp")
        if not isinstance(ts, datetime):
            continue
        d = ts.date()
        by_day.setdefault(d, DayTotals()).add_meal(m)

    for d in daterange(start_date, end_date):
        by_day.setdefault(d, DayTotals())

    # Load goals & compare
    goals = fetch_goals(client, args.db, args.goals_collection, args.user_id)

    all_cmp: Dict[date, Dict[str, Dict[str, Optional[float]]]] = {}
    for d in sorted(by_day.keys()):
        cmp = compare_to_goals(by_day[d], goals)
        all_cmp[d] = cmp
        print(render_day_report(d, cmp))

    print_summary(all_cmp)
    client.close()

if __name__ == "__main__":
    main()


'''
Example usage:
python compare_meals_to_goals_imported.py --user-id 653bd8... --pretty

# With env vars
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net"
export DB_NAME="team3project"
export GOALS_COLLECTION="goals"
python compare_meal_history.py --user-id 653bd8... --start 2025-10-01 --end 2025-10-27 --limit 500

# Explicit collections & fields (mirrors your fetcher's flags/style)
python compare_meal_history.py --uri "mongodb://localhost:27017" --db nutrition --goals-collection goals --collection mealhistories --user-id 653bd8... --user-field userId --created-field createdAt --start 2025-10-01 --end 2025-10-27 --limit 500
'''
