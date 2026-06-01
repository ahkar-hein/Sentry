from fastapi import APIRouter
from services.openai_client import client
import json

router = APIRouter()

# In a real app, this would pull from your MongoDB alert/post data
# For now it generates a mock safety assessment
@router.get("/safety/{city}")
def get_safety_score(city: str):
    prompt = f"""
You are a safety analysis AI. Generate a mock safety assessment for {city}, CA.
Respond with JSON only:
{{
  "score": 0-100,
  "level": "safe|moderate|high_risk",
  "summary": "one sentence summary",
  "tips": ["tip1", "tip2", "tip3"]
}}
Higher score = safer. Respond ONLY with the JSON.
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )
    try:
        result = json.loads(response.choices[0].message.content)
    except Exception:
        result = {"score": 50, "level": "moderate", "summary": "Safety data unavailable", "tips": []}
    return result
