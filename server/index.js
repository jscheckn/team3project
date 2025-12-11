import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import accountsRouter from './routes/accounts.js';
import goalsRouter from './routes/goals.js';
import mealsRouter from './routes/meals.js';
import recipesRouter from './routes/recipes.js';
import comparisonRouter from './routes/comparison.js';
import spoonacularRouter from './routes/spoonacular.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodtracker';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/api/accounts', accountsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/comparison', comparisonRouter);
app.use('/api/spoonacular', spoonacularRouter);
console.log("CWD:", process.cwd());
console.log("ENV KEY:", process.env.SPOONACULAR_KEY);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));