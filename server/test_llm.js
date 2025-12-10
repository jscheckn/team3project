import { getSimilarMeals } from './llm.js';

const meal = process.argv[2] || 'Chicken Alfredo';

const run = async () => {
  try {
    const result = await getSimilarMeals(meal);
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
};

run();