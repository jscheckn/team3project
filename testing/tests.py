from collections import defaultdict
import pytest


class MealObject:
    def __init__(self, name: str, protein: int, calories: int, fats: int, carbs: int):
        self.name = name
        self.protein = protein
        self.calories = calories
        self.fats = fats
        self.carbs = carbs


chicken_meal = MealObject('Chicken', 40, 400, 10, 10)
chicken_with_rice_meal = MealObject('Chicken with rice', 40, 500, 10, 20)
chicken_meal_invalid = MealObject('Chicken', -1, -1, -1, -20)  # meal fields cant be negative

def create_database():
    return defaultdict(lambda: defaultdict(list))

def add_meal(database, user, date, meal: MealObject):
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
    add_meal(db, "User 1", "10-09-2026", chicken_meal)
    assert get_meals(db, "User 1", "10-09-2026") == [chicken_meal]

def test_add_multiple_meals_same_day():
    db = create_database()
    add_meal(db, "User 1", "10-09-2026", chicken_with_rice_meal)
    #add_meal(db, "User 1", "10-09-2026", "Rice")
    assert get_meals(db, "User 1", "10-09-2026") == [chicken_with_rice_meal]

def test_add_meals_different_dates():
    db = create_database()
    add_meal(db, "User 1", "10-09-2026", chicken_meal)
    add_meal(db, "User 1", "10-19-2026", chicken_with_rice_meal)
    assert get_meals(db, "User 1", "10-09-2026") == [chicken_meal]
    assert get_meals(db, "User 1", "10-19-2026") == [chicken_with_rice_meal]

def test_multiple_users_isolated():
    db = create_database()
    add_meal(db, "User 1", "10-09-2026", chicken_meal)
    add_meal(db, "User 2", "10-09-2026", chicken_with_rice_meal)
    assert get_meals(db, "User 1", "10-09-2026") == [chicken_meal]
    assert get_meals(db, "User 2", "10-09-2026") == [chicken_with_rice_meal]
    assert "User 3" not in db

def test_empty_date_returns_empty_list():
    db = create_database()
    assert get_meals(db, "User 1", "12-31-2026") == []


