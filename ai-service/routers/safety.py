from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_client import client
import json

router = APIRouter()

class SafetyRequest(BaseModel):
    city: str
    recent_alerts: list = []  # pass real alert data for accurate scoring
    post_count: int = 0

@router.post("/safety")
def get_safety_score(request: SafetyRequest):
    # Build context from real alert data
    alert_summary = "No recent alerts"
    if request.recent_alerts:
        types = [a.get("type", "general") for a in request.recent_alerts]
        alert_summary = f"{len(types)} recent alerts: {', '.join(set(types))}"

    prompt = f"""
Analyze the safety of {request.city}, CA based on this data:
- {alert_summary}
- Community posts today: {request.post_count}

Return a JSON object only:
{{
  "score": (0-100, higher is safer),
  "level": ("safe", "moderate", or "high_risk"),
  "summary": "one sentence about current safety",
  "tips": ["tip1", "tip2", "tip3"]
}}

Base the score on the alert data. No alerts = higher score.
Respond ONLY with the JSON object.
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=250,
    )

    try:
        result = json.loads(response.choices[0].message.content)
    except Exception:
        result = {
            "score": 70,
            "level": "moderate",
            "summary": "Safety data is being analyzed.",
            "tips": ["Stay aware of your surroundings", "Report suspicious activity", "Keep emergency contacts handy"]
        }
    return result

@router.get("/safety/{city}")
def get_safety_score_simple(city: str):
    prompt = f"""
Generate a safety assessment for {city}, CA.
Return JSON only:
{{
  "score": (0-100),
  "level": ("safe", "moderate", or "high_risk"),
  "summary": "one sentence summary",
  "tips": ["tip1", "tip2", "tip3"]
}}
Respond ONLY with JSON.
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )
    try:
        result = json.loads(response.choices[0].message.content)
    except Exception:
        result = {"score": 70, "level": "moderate", "summary": "Safety data unavailable.", "tips": []}
    return result
