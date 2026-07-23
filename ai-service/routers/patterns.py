from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_client import client
import json

router = APIRouter()

class PatternRequest(BaseModel):
    city: str
    alerts: list  # list of recent alerts

@router.post("/patterns")
def detect_patterns(request: PatternRequest):
    """Analyze alerts to detect crime patterns and hotspots."""

    if not request.alerts:
        return {"patterns": [], "hotspots": [], "summary": "No recent alerts to analyze."}

    # Format alerts for AI
    alert_text = "\n".join([
        f"- {a.get('type', 'general')} at {a.get('location', {}).get('address', 'unknown location')}"
        for a in request.alerts[:10]
    ])

    prompt = f"""
Analyze these recent alerts from {request.city}, CA and identify patterns:

{alert_text}

Return JSON only:
{{
  "patterns": ["pattern1", "pattern2"],
  "hotspots": ["location1", "location2"],
  "summary": "brief analysis of crime patterns",
  "recommendation": "one safety recommendation for residents"
}}

If not enough data say so in summary. Respond ONLY with JSON.
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
            "patterns": [],
            "hotspots": [],
            "summary": "Not enough data to detect patterns yet.",
            "recommendation": "Keep reporting incidents to build a clearer picture."
        }
    return result
