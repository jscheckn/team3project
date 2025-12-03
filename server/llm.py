# NOTES: Must install ollmaa from https://ollama.com/download
# Once downloaded, add to PATH and pull relevant ollama model --> ollama pull llama3.2:1b
# This file has a decent will take a few seconds to run
'''



DEPRECRATED. USE JS FILE INSTEAD


'''
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",  # this endpoint is default for ollama, works for windows, not 100% for other OS
    api_key="ollama",
)

MODEL_NAME = "llama3.2:1b"

def get_similar_meals(meal: str) -> str:
    prompt = (
        f"Give me 3 meals that are similar to '{meal}'. "
        f"Consider ingredients, cuisine, flavor profile, and preparation style. "
        f"Return a clean bullet list only. No explanations."
    )

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content

print(get_similar_meals(meal="chicken and rice"))



# from llm.py import get_similar_meals()
# get_similar_meals(meal="chicken and rice")

