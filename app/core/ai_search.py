# app/core/ai_search.py
import openai
import json
from app.core.config import settings

client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are a real estate search assistant for Zimbabwe. 
Convert the user's natural language query into a JSON object with these fields:
- min_price (integer, USD)
- max_price (integer, USD)
- bedrooms (integer)
- suburb (string, Capitalized)
- city (string, Capitalized)
- property_type (string: "House", "Flat", "Commercial", "Land")

Rules:
1. If a value is missing, use null.
2. Assume currency is USD.
3. Correct spelling for Zimbabwean suburbs (e.g., "Avondal" -> "Avondale").
4. Return ONLY raw JSON. No markdown formatting.
"""

def interpret_search_query(query: str) -> dict:
    """
    Takes a natural language string, returns a dictionary of filters.
    """
    if not query:
        return {}

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # Cost-effective for students
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query}
            ],
            temperature=0, # Deterministic results
        )

        content = response.choices[0].message.content
        filters = json.loads(content)
        return filters
    except Exception as e:
        print(f"AI Error: {e}")
        # Fallback: simple keyword matching could go here
        return {}