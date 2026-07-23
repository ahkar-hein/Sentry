# Sentry 🛡️
### *When seconds matter, Sentry responds*

Sentry is a full-stack neighborhood safety and community platform that connects residents in real time. Users can share community posts, trigger emergency alerts, chat with neighbors, make voice calls, and get AI-powered safety insights — all within their geo-fenced city community.

---

## 🌟 Features

### Community
- **Post Feed** — share status updates, photos, videos and locations
- **Geo-fenced Communities** — post only in your home city, explore others read-only
- **Likes and Comments** — interact with neighbor posts in real time
- **File Uploads** — photo and video uploads via Cloudinary

### Emergency System
- **SOS Panic Button** — hold 3 seconds to activate
- **Emergency Type Selector** — Crime, Vehicle, Fire, Medical, Child, Suspicious
- **10-Second Countdown** — cancel window before alert fires
- **Shake to Trigger** — shake phone 3x to activate
- **Real-time Neighbor Alerts** — instant Socket.io broadcast to entire city
- **SMS Notifications** — Twilio SMS to emergency contacts

### Communication
- **Community Group Chat** — every city has a real-time group chat
- **Private Messaging** — 1-on-1 direct messages with any neighbor
- **Voice Calls** — in-app voice calls using native WebRTC

### AI Features (Python FastAPI)
- **AI Chatbot** — ask questions about safety and app features
- **Safety Score** — real-time neighborhood safety rating 0-100
- **Crime Pattern Detection** — AI analyzes recent alerts to find patterns
- **Auto Post Tagging** — AI automatically tags every post by category
- **Emergency Detection** — AI flags posts that look like emergencies

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI Service | Python, FastAPI, OpenAI API |
| Real-time | Socket.io |
| Voice Calls | WebRTC (native browser API) |
| File Uploads | Cloudinary |
| Authentication | JWT, bcrypt |
| SMS Alerts | Twilio |

---

## 🏗️ Architecture

```
React Client :5173
      |
      | REST + Socket.io
      |
Node.js Server :5000
      |
      |--- MongoDB (database)
      |
      |--- Python FastAPI :8000 (AI service)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.11
- MongoDB
- OpenAI API key
- Cloudinary account
- Twilio account (optional for SMS)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/sentry.git
cd sentry
```

### 2. Server setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 3. AI service setup
```bash
cd ai-service
py -3.11 -m pip install -r requirements.txt
cp .env.example .env
py -3.11 -m uvicorn main:app --reload --port 8000
```

### 4. Client setup
```bash
cd client
npm install
npm run dev
```

### 5. Seed communities
```bash
cd server
node config/seedCommunities.js
```

### 6. Open the app
```
http://localhost:5173
```

---

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/sentry
JWT_SECRET=your_jwt_secret
AI_SERVICE_URL=http://localhost:8000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
POLICE_PHONE_NUMBER=your_test_number
```

### ai-service/.env
```
OPENAI_API_KEY=your_openai_key
```

---

## 📁 Project Structure

```
sentry/
├── client/                  # React frontend
│   └── src/
│       ├── components/
│       │   ├── ai/          # AI chatbot, safety score, crime patterns
│       │   ├── chat/        # Group chat, private chat, voice calls
│       │   ├── emergency/   # Panic button, alert history
│       │   ├── layout/      # Navbar
│       │   └── posts/       # Post feed, post card, create post
│       ├── context/         # Auth context, call context
│       ├── hooks/           # Shake detection
│       ├── pages/           # Home, Explore, Chat, AI pages
│       └── utils/           # Axios instance, Socket.io client
│
├── server/                  # Node.js backend
│   ├── config/              # Cloudinary, multer, seed data
│   ├── controllers/         # Auth, posts, alerts, chat, upload
│   ├── middleware/          # JWT auth, community access guard
│   ├── models/              # User, Post, Comment, Alert, Message, Community
│   ├── routes/              # All API routes
│   └── socket/              # Socket.io event handlers
│
└── ai-service/              # Python FastAPI AI service
    ├── routers/             # Chat, classify, safety, patterns
    └── services/            # OpenAI client
```

---

## 🔌 API Overview

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts/:city | Get city posts |
| POST | /api/posts | Create post |
| PUT | /api/posts/:id/like | Toggle like |
| POST | /api/posts/:id/comments | Add comment |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/alerts | Fire emergency alert |
| GET | /api/alerts/:city | Get city alerts |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/chat/group/:city | Get group messages |
| POST | /api/chat/group | Send group message |
| GET | /api/chat/private/:userId | Get private messages |
| POST | /api/chat/private | Send private message |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/chat | AI chatbot |
| GET | /api/ai/safety/:city | Safety score |
| POST | /api/ai/patterns | Crime pattern analysis |

---

## 💡 Key Technical Decisions

**Why a separate Python AI service?**
Python has superior AI libraries. Keeping AI in a separate microservice means it can be scaled and updated independently from the main backend.

**Why native WebRTC over a library?**
Using the browser built-in RTCPeerConnection API avoids dependency issues and gives full control over the signaling process. Socket.io handles the signaling layer.

**Why geo-fenced communities?**
Safety information is hyper-local. Restricting posts to home cities keeps content relevant while allowing read-only access to nearby communities.

---

## 🗺️ Supported Communities

Currently supporting 15 LA County cities including Pomona, Los Angeles, Claremont, La Verne, Ontario, Rancho Cucamonga, Pasadena, Long Beach, Compton, Inglewood, Glendale, Burbank, Santa Monica, Torrance, and Carson.

---

## 👨‍💻 Built By

Ahkar — Full Stack Developer

[GitHub](https://github.com/yourusername) · [Portfolio](https://yourportfolio.com) · [LinkedIn](https://linkedin.com/in/yourusername)