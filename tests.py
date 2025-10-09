from collections import defaultdict
import pytest

def create_database():
    return defaultdict(lambda: defaultdict(list))

def add_meal(database, user, date, meal):
    database[user][date].append(meal)

def get_meals(database, user, date):
    return database[user][date]


# Tests below for Meal History ticket (saving user's previous meals)
# Using in memory db, potentially we swap this out for proper db (postgres or equivalent) once we set it up
def test_initial_empty_database():
    db = create_database()
    assert isinstance(db, defaultdict)
    assert db == {}

def test_add_single_meal():
    db = create_database()
    add_meal(db, "User 1", "10-09-2026", "Chicken")
    assert get_meals(db, "User 1", "10-09-2026") == ["Chicken"]

def test_add_multiple_meals_same_day():
    db = create_database()
    add_meal(db, "User 1", "10-09-2026", "Chicken")
    add_meal(db, "User 1", "10-09-2026", "Rice")
    assert get_meals(db, "User 1", "10-09-2026") == ["Chicken", "Rice"]

def test_add_meals_different_dates():
    db = create_database()
    add_meal(db, "User 1", "10-09-2026", "Chicken")
    add_meal(db, "User 1", "10-10-2026", "Fish")
    assert get_meals(db, "User 1", "10-09-2026") == ["Chicken"]
    assert get_meals(db, "User 1", "10-10-2026") == ["Fish"]

def test_multiple_users_isolated():
    db = create_database()
    add_meal(db, "User 1", "10-09-2026", "Chicken")
    add_meal(db, "User 2", "10-09-2026", "Steak")
    assert get_meals(db, "User 1", "10-09-2026") == ["Chicken"]
    assert get_meals(db, "User 2", "10-09-2026") == ["Steak"]
    assert "User 3" not in db

def test_empty_date_returns_empty_list():
    db = create_database()
    assert get_meals(db, "User 1", "12-31-2026") == []
