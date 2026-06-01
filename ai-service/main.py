from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, classify, safety

app = FastAPI(title="Sentry AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(classify.router)
app.include_router(safety.router)

@app.get("/")
def root():
    return {"message": "Sentry AI running"}
