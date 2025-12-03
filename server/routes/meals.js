//backend meals route
import express from 'express';
import {
  getMealsByUserId,
  addMeal,
} from '../data/mealData.js';
import * as accounts from "../data/accounts.js";

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    let account;
    try {
      account = await accounts.validate(req.cookies.token);
    } catch (e) {
      return res.status(401).json({error: e.message});
    }

    const meals = await getMealsByUserId(account.email);
    res.json(meals);
  } catch (err) {
    console.error('Failed to fetch meals:', err);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});




router.post('/', async (req, res) => {
  try {
    let account;
    try {
      account = await accounts.validate(req.cookies.token);
    } catch (e) {
      return res.status(401).json({error: e.message});
    }

    const { items, notes } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: 'at least one food item is required' });
    }

    const meal = await addMeal({ userId: account.email, items, notes });
    res.status(201).json(meal);
  } catch (err) {
    console.error('Failed to add meal:', err);
    res.status(500).json({ error: 'Failed to add meal' });
  }
});

export default router;