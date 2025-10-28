//Holds functions for meals.js
import Meal from '../models/Meal.js';

export async function getAllMeals() {
  return Meal.find().exec();
}

export async function getMealsByUserId(userId) {
  return Meal.find({ userId }).exec();
}

export async function addMeal({ userId, items, notes }) {
  const meal = new Meal({
    userId,
    items,
    notes
  });
  
  await meal.save();
  return meal;
}


