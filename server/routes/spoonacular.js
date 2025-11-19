import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import Meal from '../models/Meal.js'; // adjust if your Meal model path/name differs

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

const SPOON_KEY = process.env.SPOONACULAR_KEY;
if (!SPOON_KEY) {
  console.warn('Warning: SPOONACULAR_KEY not set in environment');
}

//turn response into caption
function makeCaptionFromAnalysis(respJson) {
  const parts = [];

  if (respJson.labels && Array.isArray(respJson.labels)) {
    const top = respJson.labels.slice(0, 3).map(l => l.name);
    if (top.length) parts.push(top.join(', '));
  }

  if (respJson.detections && Array.isArray(respJson.detections)) {
    const dets = respJson.detections.slice(0, 3).map(d => d.name || d.label || '').filter(Boolean);
    if (dets.length) parts.push(dets.join(', '));
  }

  if (respJson.classifications && Array.isArray(respJson.classifications)) {
    const cls = respJson.classifications.slice(0, 3).map(c => c.name || c.label).filter(Boolean);
    if (cls.length) parts.push(cls.join(', '));
  }

  if (respJson.recipes && Array.isArray(respJson.recipes) && respJson.recipes.length) {
    if (respJson.recipes[0].title) parts.push(respJson.recipes[0].title);
  }

  if (parts.length) {
    
    return 'A photo of ' + parts.join(', ');
  }

  
  return `Analyzed image — results: ${Object.keys(respJson).join(', ')}`;
}

// caption post route
router.post('/caption', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded (field name must be "image")' });

    //form data to send to api
    const form = new FormData();
    
    form.append('file', req.file.buffer, {
      filename: req.file.originalname || 'upload.jpg',
      contentType: req.file.mimetype || 'image/jpeg',
      knownLength: req.file.size
    });

    const spoonUrl = `https://api.spoonacular.com/food/images/analyze?apiKey=${process.env.SPOONACULAR_KEY}`;

    const response = await axios.post(spoonUrl, form, {
      headers: {
        ...form.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 3000
    });

    const spoonResult = response.data;



    // convert response to caption
    const caption = makeCaptionFromAnalysis(spoonResult);

    // ingredients array from labels/detections
    const ingredients = [];
    if (spoonResult.labels && Array.isArray(spoonResult.labels)) {
      for (const l of spoonResult.labels) {
        if (l.name) ingredients.push(l.name);
      }
    } else if (spoonResult.detections && Array.isArray(spoonResult.detections)) {
      for (const d of spoonResult.detections) {
        if (d.name) ingredients.push(d.name);
      }
    }

    // Build a meal object we can save if desired
    const mealObj = {
      name: caption,
      caption,
      ingredients,
      portion: '1 serving',
      estimatedCalories: null
    };


    
    return res.json({ caption, ingredients, raw: spoonResult });
  } catch (err) {
    console.error('Spoonacular error:', err.response ? err.response.data : err.message);
    const status = err.response && err.response.status ? err.response.status : 500;
    const data = err.response && err.response.data ? err.response.data : { error: err.message };
    return res.status(status).json({ error: 'Spoonacular request failed', details: data });
  }
});

export default router;