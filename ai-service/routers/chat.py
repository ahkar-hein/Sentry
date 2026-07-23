from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_client import client

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    city: str = "your area"
    recent_alerts: list = []  # pass recent alerts for context

SYSTEM_PROMPT = """
You are Sentry AI, the built-in assistant for the Sentry community safety app.

ABOUT SENTRY APP - answer questions about these specific features:
- Home Feed: Users can post status updates, photos, videos and locations in their home city
- Explore: Users can view posts from other cities in read-only mode
- Emergency SOS: Red SOS button on home page - hold 3 seconds, pick emergency type, 10 second countdown sends alert to all neighbors
- Emergency Types: Crime, Vehicle, Fire, Medical, Child, Suspicious
- Group Chat: Every city has a community group chat - go to Chat tab, click Community Chat
- Private Chat: Yes! Users CAN message neighbors privately - go to Chat tab, click Neighbors, find the person, click the 💬 button
- Voice Calls: Users can make voice calls to neighbors - go to Chat tab, click Neighbors, click the 📞 button
- AI Features: Safety score, crime pattern detection, and this chatbot - all in the AI tab
- Geo-fence: Users can only post in their home city but can view other cities in Explore
- Communities: Currently supports LA County cities including Pomona, Los Angeles, Claremont, and more

RULES:
- Always give specific answers about Sentry features
- If asked about a feature that exists, explain exactly how to use it
- Be concise - 2-3 sentences max
- Never say "check the settings" - give the actual answer
- Always remind users that Sentry does not replace 911 for emergencies
"""

@router.post("/chat")
def chat(request: ChatRequest):
    # Build context from recent alerts
    alert_context = ""
    if request.recent_alerts:
        alert_context = f"\nRecent alerts in {request.city}: " + ", ".join(
            [f"{a.get('type', 'general')} alert" for a in request.recent_alerts[:3]]
        )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"[User is in {request.city}]{alert_context}\n\nUser: {request.message}"},
        ],
        max_tokens=200,
    )
    return {"reply": response.choices[0].message.content}
