from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_client import client

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    city: str = "your area"

SYSTEM_PROMPT = """
You are Sentry AI, a safety assistant for a neighborhood community app.
Help users with:
- Safety tips and awareness
- What to do in emergencies
- Information about recent activity in their area
- How to use the app features
Be concise, calm, and helpful. Never panic users unnecessarily.
"""

@router.post("/chat")
def chat(request: ChatRequest):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"[User is in {request.city}] {request.message}"},
        ],
        max_tokens=300,
    )
    return {"reply": response.choices[0].message.content}
