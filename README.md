# Sentry 🛡️
### *When seconds matter, Sentry responds*

A geo-fenced community safety platform with real-time emergency alerts,
community posts, group/private chat, voice calls, and AI-powered crime detection.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Voice Calls | WebRTC (simple-peer) |
| Database | MongoDB (Mongoose) |
| AI Service | Python + FastAPI |
| SMS Alerts | Twilio |
| Push Notifications | Firebase Cloud Messaging |

## Project Structure
```
sentry/
├── client/         # React web app
├── server/         # Node.js + Express + Socket.io
└── ai-service/     # Python FastAPI AI features
```

## Getting Started

### 1. Server
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. AI Service
```bash
cd ai-service
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

### 3. Client
```bash
cd client
npm install
npm run dev
```

## Build Phases
- Phase 1 → Auth + community assignment by city
- Phase 2 → Community posts (status, photo, video, location)
- Phase 3 → Emergency alert system (panic button, shake, countdown)
- Phase 4 → Group chat + private chat (Socket.io)
- Phase 5 → Voice calls (WebRTC)
- Phase 6 → AI features (crime patterns, safety score, chatbot)
- Phase 7 → Subscription model + ZIP code communities
