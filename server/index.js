import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import goalsRouter from './routes/goals.js';

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodtracker';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/api/goals', goalsRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));