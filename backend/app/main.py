import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from app.database import engine, Base
from app.routers import auth, transactions, predictions, finbot_routers as finbot

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NaviKas API", version="1.0.0", description="NaviKas - Financial Intelligence API")

frontend_url = os.getenv("FRONTEND_URL", "")
origins = [
    "http://localhost:5173",
    "https://localhost:5173",
    "https://navi-kas.vercel.app",
]
if frontend_url:
    origins.append(frontend_url)
    # tambah versi https juga
    if frontend_url.startswith("http://"):
        origins.append(frontend_url.replace("http://", "https://"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(auth.router)
app.include_router(transactions.router, prefix="/api/transactions")
app.include_router(predictions.router, prefix="/api/predict")
app.include_router(finbot.router)

@app.get("/")
def root():
    return {"app": "FinTrack API", "version": "1.0.0", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok"}