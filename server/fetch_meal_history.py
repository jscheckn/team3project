#!/usr/bin/env python3
import os
import sys
import argparse
from datetime import datetime
from typing import Optional, List

from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import ConnectionFailure
from bson.json_util import dumps
from bson import ObjectId

DEFAULT_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DEFAULT_DB  = os.getenv("DB_NAME", "test")

MEAL_COLLECTION_CANDIDATES: List[str] = [
    os.getenv("MEAL_COLLECTION", "").strip() or "",  # idk what we're querying yeet
    "mealhistories", "meal_history", "mealHistory", "mealHistories", "meals", "meal"
]

def parse_dt(s: Optional[str]) -> Optional[datetime]:
    if not s:
        return None
    # Accept ISO-like strings: "2025-10-27", "2025-10-27T13:45"
    try:
        return datetime.fromisoformat(s)
    except ValueError:
        try:
            return datetime.strptime(s, "%Y-%m-%d")
        except ValueError as e:
            raise argparse.ArgumentTypeError(f"Invalid date/time: {s}") from e

def pick_meal_collection(db, preferred: Optional[str]) -> str:
    existing = set(db.list_collection_names())
    if preferred and preferred in existing:
        return preferred
    for name in [c for c in MEAL_COLLECTION_CANDIDATES if c]:
        if name in existing:
            return name
    mealish = sorted([n for n in existing if "meal" in n.lower()])
    if mealish:
        return mealish[0]
    raise RuntimeError(
        f"No meal-history collection found. Existing collections: {sorted(existing)}\n"
        "Set MEAL_COLLECTION env var to the correct collection name."
    )

def build_time_filter(created_field: str, start: Optional[datetime], end: Optional[datetime]):
    if not start and not end:
        return {}
    q = {}
    if start: q["$gte"] = start
    if end:   q["$lte"] = end
    return {created_field: q}

def main():
    ap = argparse.ArgumentParser(description="Fetch meal history documents from MongoDB.")
    ap.add_argument("--uri", default=DEFAULT_URI, help="MongoDB URI (default: env MONGODB_URI or mongodb://localhost:27017)")
    ap.add_argument("--db", default=DEFAULT_DB, help="Database name (default: env DB_NAME or 'test')")
    ap.add_argument("--collection", default=os.getenv("MEAL_COLLECTION", ""), help="Explicit collection name (overrides auto-detect)")
    ap.add_argument("--user-id", help="Filter by user id field if your schema includes it (e.g., 'userId').")
    ap.add_argument("--user-field", default="userId", help="Field name for user id (default: userId)")
    ap.add_argument("--start", type=parse_dt, help="Start datetime (e.g., 2025-10-01 or 2025-10-01T00:00)")
    ap.add_argument("--end", type=parse_dt, help="End datetime (e.g., 2025-10-27 or 2025-10-27T23:59)")
    ap.add_argument("--limit", type=int, default=200, help="Max docs to return (default: 200)")
    ap.add_argument("--pretty", action="store_true", help="Pretty-print JSON.")
    ap.add_argument("--created-field", default="createdAt", help="Timestamp field (default: createdAt).")
    args = ap.parse_args()

    try:
        client = MongoClient(args.uri, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
    except ConnectionFailure as e:
        print(f"ERROR: Could not connect to MongoDB at {args.uri}: {e}", file=sys.stderr)
        sys.exit(1)

    db = client[args.db]
    try:
        coll_name = pick_meal_collection(db, args.collection or None)
    except RuntimeError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(2)

    coll = db[coll_name]

    # Build query
    query = {}
    if args.user_id:
        query["$or"] = [
            {args.user_field: args.user_id},
            {args.user_field: ObjectId(args.user_id)} if ObjectId.is_valid(args.user_id) else {"__noop__": None}
        ]

    tf = build_time_filter(args.created_field, args.start, args.end)
    if tf:
        query.update(tf)

    sort_field = args.created_field if args.created_field in coll.index_information() or coll.find_one({args.created_field: {"$exists": True}}) else "_id"

    cursor = coll.find(query).sort(sort_field, DESCENDING).limit(args.limit)

    docs = list(cursor)
    if args.pretty:
        print(dumps(docs, indent=2, ensure_ascii=False))
    else:
        print(dumps(docs))

    client.close()

if __name__ == "__main__":
    main()


'''
Example usage:
python fetch_meal_history.py --pretty

# With env vars
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net"
export DB_NAME="team3project"
python fetch_meal_history.py --pretty

# Explicit collection name
python fetch_meal_history.py --collection mealhistories --pretty

# Filter by user and date range
python fetch_meal_history.py --user-id 653bd8... --start 2025-10-01 --end 2025-10-27 --limit 100 --pretty

'''