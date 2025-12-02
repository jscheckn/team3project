import express from 'express';
import multer from 'multer';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyPath = path.join(__dirname, '..', 'vision-key.json');


const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

const visionClient = new ImageAnnotatorClient({
  keyFilename: keyPath
});


function makeCaptionFromVision(labels) {
  if (!labels || !labels.length) return "Error in uploading image";

  const generic = [
    "food", "dish", "cuisine", "ingredient", "meal", "fried food", "fast food"
  ];

  const filtered = labels.filter(
    l => !generic.includes(l.description.toLowerCase())
  );

  const best = filtered.length ? filtered[0].description : labels[0].description;
  
  return best;
}

// POST /api/spoonacular/caption
router.post('/caption', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image uploaded (field name must be 'image')"
      });
    }

    const [visionResult] = await visionClient.labelDetection({
      image: { content: req.file.buffer }
    });

    const labels = visionResult.labelAnnotations || [];


    const caption = makeCaptionFromVision(labels);
    console.log("VISION LABELS:", labels.map(l => l.description));
    const ingredients = labels
      .filter(l => l.description)
      .slice(0, 10)
      .map(l => l.description);

    return res.json({
      caption,
      ingredients,
      raw: labels
    });

  } catch (err) {
    console.error("Google Vision error:", err);
    return res.status(500).json({
      error: "Google Vision request failed",
      details: err.message
    });
  }
});

export default router;