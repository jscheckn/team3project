import express from "express";
import { getSimilarMeals } from "../../server/llm";

const router = express.Router();

router.get("/similar/:meal", async (req, res) => {
  try {
    const meals = await getSimilarMeals(req.params.meal);
    res.json({ meals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;