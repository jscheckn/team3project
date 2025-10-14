from collections import defaultdict
import pytest

def create_database():
    return defaultdict(lambda: defaultdict(list))

def add_meal(database, user, date, meal):
    database[user][date].append(meal)

def get_meals(database, user, date):
    return database[user][date]

def add_calories(database, user, date, cals):
    database[user][date].append(cals)

def get_calories(database, user, date):
    return database[user][date]



#Unit tests
def test_initial_empty_database():
    db = create_database()
    assert isinstance(db, defaultdict)
    assert db == {}

def test_add_single_meal():
    db = create_database()
    add_meal(db, "User1", "2026-11-01", "Pasta")
    assert get_meals(db, "User1", "2026-11-01") == ["Pasta"]

def test_add_calories_to_meal():
    db = create_database()
    add_meal(db, "User1", "2026-11-02", "Salad")
    add_calories(db, "User1", "2026-11-02", 200)
    assert get_meals(db, "User1", "2026-11-02") == ["Salad", 200]

def test_add_calories_to_meal_separate_days():
    db = create_database()
    add_meal(db, "User1", "2026-11-03", "Steak")
    add_calories(db, "User1", "2026-11-03", 600)
    add_meal(db, "User1", "2026-11-04", "Tacos")
    add_calories(db, "User1", "2026-11-04", 300)
    assert get_meals(db, "User1", "2026-11-03") == ["Steak", 600]
    assert get_meals(db, "User1", "2026-11-04") == ["Tacos", 300]

def test_multiple_users_isolated():
    db = create_database()
    add_meal(db, "User1", "2026-11-05", "Pancakes")
    add_meal(db, "User2", "2026-11-05", "Sushi")
    add_calories(db, "User1", "2026-11-05", 350)
    add_calories(db, "User2", "2026-11-05", 500)
    assert get_meals(db, "User1", "2026-11-05") == ["Pancakes", 350]
    assert get_meals(db, "User2", "2026-11-05") == ["Sushi", 500]
    assert "User3" not in db

def test_empty_date_returns_empty_list():
    db = create_database()
    assert get_meals(db, "User1", "2026-12-31") == []

def test_multiple_meals_same_day():
    db = create_database()
    add_meal(db, "User1", "2026-11-06", "Omelette")
    add_meal(db, "User1", "2026-11-06", "Toast")
    add_calories(db, "User1", "2026-11-06", 150)
    assert get_meals(db, "User1", "2026-11-06") == ["Omelette", "Toast", 150]
