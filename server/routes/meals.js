//backend meals route
import express from 'express';
import {
  getAllMeals,
  getMealsByUserId,
  addMeal,
} from '../data/mealData.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    let meals;
    if (userId) {
      meals = await getMealsByUserId(userId);
    } else {
      meals = await getAllMeals();
    }

    res.json(meals);
  } catch (err) {
    console.error('Failed to fetch meals:', err);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});




router.post('/', async (req, res) => {
  try {
    const { userId, items, notes } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (!items || !items.length) {
      return res.status(400).json({ error: 'at least one food item is required' });
    }

    const meal = await addMeal({ userId, items, notes });
    res.status(201).json(meal);
  } catch (err) {
    console.error('Failed to add meal:', err);
    res.status(500).json({ error: 'Failed to add meal' });
  }
});

export default router;