# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, transactions, predictions, finbot_routers as finbot
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinTrack API", version="1.0.0", description="Financial Intelligence API")

app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"], allow_headers=["*"], allow_credentials=True)

app.include_router(auth.router)                              # ← hapus prefix
app.include_router(transactions.router, prefix="/api/transactions")
app.include_router(predictions.router,  prefix="/api/predict")
app.include_router(finbot.router)

@app.get("/")
def root():
    return {"app": "FinTrack API", "version": "1.0.0", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok"}