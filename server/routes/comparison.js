import express from 'express';
import Goal from '../models/Goal.js';
import { getAllMeals, getMealsByUserId } from '../data/mealData.js';

const router = express.Router();
//get comparison of meals vs goals
router.get('/', async (req, res) => {
    try {
		const { userId } = req.query;

		const meals = userId ? await getMealsByUserId(userId) : await getAllMeals();
		const goals = await Goal.find().exec();

		const totals = meals.reduce(
			(acc, meal) => {
				if (Array.isArray(meal.items)) {
					for (const it of meal.items) {
						const c = Number(it?.calories ?? 0) || 0;
						const p = Number(it?.protein ?? 0) || 0;
						acc.calories += c;
						acc.protein += p;
					}
				}
				return acc;
			},
			{ calories: 0, protein: 0 }
		);

		//comparisons
		const comparisons = goals.map((g) => {
			const type = (g.type || '').toLowerCase();
			let goalAmount = typeof g.amount === 'number' ? g.amount : undefined;
			let total = undefined;

			if (type.includes('calories')) {
				total = totals.calories;
			} else if (type.includes('protein')) {
				total = totals.protein;
			}
            //helper function to check if goal was met and difference
            const compareWithGoal = (total, goal) => {
                if (typeof total !== 'number' || typeof goal !== 'number') {
                    return { meetsGoal: undefined, difference: undefined };
                }
                return {
                    meetsGoal: total <= goal,
                    difference: total - goal
                };
            };

            const comparison = compareWithGoal(total, goalAmount);

			return {
				goalId: g._id,
				type: g.type,
				scale: g.scale,
				goalAmount,
				total,
				meetsGoal: comparison.meetsGoal,
				difference: comparison.difference,
				description: g.description,
			};
		});
		//res.json({ meals, goals, totals, comparisons }); can be changed for more info to display
        res.json({ comparisons });
	} catch (err) {
		console.error('Failed to generate comparison:', err);
		res.status(500).json({ error: 'Failed to generate comparison' });
	}
});
export default router;
