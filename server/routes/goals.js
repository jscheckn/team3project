import express from 'express';
import Goal from '../models/Goal.js';
import * as accounts from "../data/accounts.js";
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let account;
    try {
      account = await accounts.validate(req.cookies.token);
    } catch (e) {
      return res.status(401).json({error: e.message});
    }

    const { type, scale, amount, description } = req.body;
    if (!type) return res.status(400).json({ error: 'type is required' });

    const goal = new Goal({
      userId: account.email,
      type,
      scale,
      amount: amount === undefined || amount === '' ? undefined : Number(amount),
      description
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    console.error('Failed to save goal:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/goals - return all goals (most recent first)
router.get('/', async (req, res) => {
  try {
    let account;
    try {
      account = await accounts.validate(req.cookies.token);
    } catch (e) {
      return res.status(401).json({error: e.message});
    }
    const goals = await Goal.find({userId: account.email}).sort({ createdAt: -1 }).exec();
    res.json(goals);
  } catch (err) {
    console.error('Failed to fetch goals:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;