// NOTES: Must install ollama from https://ollama.com/download
// Once downloaded, add to PATH and pull relevant ollama model --> ollama pull llama3.2:1b
// Heads up, this function will take a few seconds to run
import ollama from 'ollama';

const MODEL_NAME = 'llama3.2:1b';

export async function getSimilarMeals(meal) {
  if (!meal || typeof meal !== 'string') {
    throw new Error('Meal must be a non-empty string.');
  }

  const prompt = `
    Give me 5 meals that are similar to "${meal}".
    Consider ingredients, cuisine, flavor profile, and preparation style.
    Respond only with the meals' names, each on a new line.
    Do not add any text before or afterwards and do not write bullet points.
  `;

  const response = await ollama.chat({
    model: MODEL_NAME,
    messages: [
      { role: 'user', content: prompt }
    ]
  });

  return response.message.content.split('\n');
}