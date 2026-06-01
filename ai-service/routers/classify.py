from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_client import client
import json

router = APIRouter()

class ClassifyRequest(BaseModel):
    content: str

@router.post("/classify")
def classify_post(request: ClassifyRequest):
    """
    Analyze a post and:
    1. Auto-tag it with categories
    2. Detect if it sounds like an emergency (even without SOS button)
    """
    prompt = f"""
Analyze this community post and respond with JSON only:
{{
  "tags": ["tag1", "tag2"],
  "is_emergency": true or false,
  "emergency_type": "crime|vehicle|fire|medical|child|suspicious|null"
}}

Tags must be from: [crime, vehicle, fire, medical, event, help, food, news, general]
is_emergency = true only if the post sounds urgent and dangerous.

Post: {request.content}

Respond ONLY with the JSON object.
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100,
    )
    try:
        result = json.loads(response.choices[0].message.content)
    except Exception:
        result = {"tags": ["general"], "is_emergency": False, "emergency_type": None}
    return result
