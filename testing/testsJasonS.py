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

def remove_meal(database, user, date, meal):
    if meal in database[user][date]:
        database[user][date].remove(meal)
def get_all_meals_for_user(database, user):
    return dict(database[user])



def test_create_database_starts_empty():
    db = create_database()
    assert len(db) == 0

def test_add_and_get_meal():
    db = create_database()
    add_meal(db, "User 1", "10-10-2025", "Pizza")
    meals = get_meals(db, "User 1", "10-10-2025")
    assert meals == ["Pizza"]

def test_add_and_get_calories():
    db = create_database()
    add_meal(db, "User 1", "10-10-2025", "Beef")
    add_calories(db, "User 1", "10-10-2025", "250")
    cals = get_calories(db, "User 1", "10-10-2025")
    assert cals == ["Beef", "250"]

def test_get_all_meals_for_user():
    db = create_database()
    add_meal(db, "User 1", "10-10-2025", "Beef")
    add_calories(db, "User 1", "10-10-2025", "250")
    add_meal(db, "User 1", "10-11-2025", "Ice Cream")
    add_calories(db, "User 1", "10-11-2025", "500")
    allmeals = get_all_meals_for_user(db, "User 1")
    assert allmeals == {'10-10-2025': ['Beef', '250'], '10-11-2025': ['Ice Cream', '500']}
