//holds necessary data functions for goals.js
import Goal from "../models/Goal.js";

export async function getGoalsByUserId(userId) {
  return Goal.find({userId}).sort({ createdAt: -1 }).exec();
}

export async function addGoal({ userId, type, scale, amount, description }) {
  const goal = new Goal({
    userId,
    type,
    scale,
    amount: amount === undefined || amount === '' ? undefined : Number(amount),
    description
  });

  await goal.save();
  return goal;
}
