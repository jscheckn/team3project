import express from 'express';
import multer from 'multer';
import { Ollama } from 'ollama';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const ollama = new Ollama({ 
  host: 'http://localhost:11434',
  timeout: 300000 
});


async function getCaptionFromOllama(imageBuffer) {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    const response = await ollama.generate({
      model: 'llava',
      prompt: `Identify this food in 2-3 words and list 5 ingredients.

Format:
Caption: [food name]
Ingredients: [item1], [item2], [item3], [item4], [item5]`,
      images: [base64Image],
      stream: false,
      options: {
        num_predict: 100,       // improve speed
        temperature: 0.1,      
        top_k: 10,             
        top_p: 0.5,             
        repeat_penalty: 1.1,    
      }
    });

    return parseOllamaResponse(response.response);
  } catch (err) {
    console.error("Ollama error:", err);
    throw err;
  }
}

function parseOllamaResponse(text) {
  console.log("Raw Ollama response:", text);
  
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let caption = "Unknown food";
  let ingredients = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    
    if (lower.startsWith('caption:')) {
      caption = line.substring(line.indexOf(':') + 1).trim();
    } else if (lower.startsWith('ingredients:')) {
      const ingText = line.substring(line.indexOf(':') + 1).trim();
      ingredients = ingText
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0 && i.toLowerCase() !== 'none');
    }
  }

 
  if (ingredients.length === 0) {
    // look for words in the response
    const words = text.match(/\b[a-zA-Z]+(?:\s+[a-zA-Z]+)?\b/g) || [];
    ingredients = [...new Set(words.slice(0, 8))]; //unique words
  }

  return { caption, ingredients };
}

router.post('/caption', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image uploaded (field name must be 'image')"
      });
    }

    const { caption, ingredients } = await getCaptionFromOllama(req.file.buffer);

    console.log("OLLAMA CAPTION:", caption);
    console.log("OLLAMA INGREDIENTS:", ingredients);

    return res.json({
      caption,
      ingredients,
      model: 'llava'
    });

  } catch (err) {
    console.error("Ollama processing error:", err);
    return res.status(500).json({
      error: "Ollama request failed",
      details: err.message
    });
  }
});

export default router;