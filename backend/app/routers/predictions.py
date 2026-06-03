from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import extract
from app.database import get_db
from app.models import Transaction, User, Prediction
from app.ml.predict import predict_balance, compute_dna_score
from app.routers.auth import get_current_user
from datetime import datetime
import uuid

router = APIRouter(tags=["predictions"])

# PENTING: /history/all harus SEBELUM /{month}
@router.get("/history/all")
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    preds = db.query(Prediction).filter(
        Prediction.user_id == current_user.id
    ).order_by(Prediction.month.desc()).all()
    return preds

@router.get("/{month}")
def get_prediction(
    month: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    year, mon = map(int, month.split("-"))
    txns = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        extract("year",  Transaction.date) == year,
        extract("month", Transaction.date) == mon
    ).all()

    txn_list = [{
        "amount": t.amount,
        "type": t.type,
        "category_id": str(t.category_id) if t.category_id else "other",
        "is_impulsive": t.is_impulsive
    } for t in txns]

    pred = predict_balance(txn_list, month)
    dna  = compute_dna_score(txn_list, budget=getattr(current_user, 'budget', None) or 8_000_000)

    # .get() agar tidak KeyError jika key tidak ada
    impulse_count = dna.get("impulse_count", 0)
    dna_score     = dna.get("total_score", 0)

    existing = db.query(Prediction).filter(
        Prediction.user_id == current_user.id,
        Prediction.month == month
    ).first()

    if existing:
        existing.predicted_balance = pred["predicted_balance"]
        existing.risk_level        = pred["risk_level"]
        existing.dna_score         = dna_score
        existing.impulse_count     = impulse_count
    else:
        db.add(Prediction(
            id=uuid.uuid4(),
            user_id=current_user.id,
            month=month,
            predicted_balance=pred["predicted_balance"],
            risk_level=pred["risk_level"],
            dna_score=dna_score,
            impulse_count=impulse_count,
        ))
    db.commit()

    return {
        **pred,
        "dna": dna,
        "month": month,
        "transaction_count": len(txn_list),
    }