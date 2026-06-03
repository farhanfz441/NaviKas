from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import extract
from app.database import get_db
from app.models import Transaction, User
from app.ml.predict import is_impulsive
from app.routers.auth import get_current_user
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter(tags=["transactions"])

VALID_SLUGS = {"food","transport","health","shop","entertain","salary","other"}

class TxnCreate(BaseModel):
    amount: float
    type: str
    description: str
    category_id: Optional[str] = None
    date: Optional[str] = None

class TxnUpdate(BaseModel):
    amount: Optional[float] = None
    type: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    date: Optional[str] = None

@router.put("/{id}")
def update_transaction(
    id: str,
    payload: TxnUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    txn = db.query(Transaction).filter(
        Transaction.id == id,
        Transaction.user_id == current_user.id
    ).first()
    if not txn:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")

    if payload.amount is not None:
        txn.amount = payload.amount
    if payload.type is not None:
        txn.type = payload.type
    if payload.description is not None:
        txn.description = payload.description
    if payload.category_id is not None:
        slug = payload.category_id if payload.category_id in VALID_SLUGS else "other"
        txn.category_slug = slug
        txn.is_impulsive = is_impulsive(txn.amount, slug, txn.date)
    if payload.date is not None:
        txn.date = datetime.fromisoformat(payload.date)

    db.commit()
    db.refresh(txn)
    return txn    

@router.get("/summary")
def get_summary(
    month: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    q = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    if month:
        year, mon = map(int, month.split("-"))
        q = q.filter(
            extract("year",  Transaction.date) == year,
            extract("month", Transaction.date) == mon
        )
    txns = q.all()
    income  = sum(t.amount for t in txns if t.type == "income")
    expense = sum(t.amount for t in txns if t.type == "expense")
    impulse = sum(1 for t in txns if t.is_impulsive)
    return {
        "total_income": income,
        "total_expense": expense,
        "balance": income - expense,
        "impulse_count": impulse,
        "transaction_count": len(txns),
    }

@router.get("/")
def get_transactions(
    month: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    q = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    if month:
        year, mon = map(int, month.split("-"))
        q = q.filter(
            extract("year",  Transaction.date) == year,
            extract("month", Transaction.date) == mon
        )
    return q.order_by(Transaction.date.desc()).all()

@router.post("/")
def create_transaction(
    payload: TxnCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    date = datetime.fromisoformat(payload.date) if payload.date else datetime.utcnow()

    # category_id dari frontend adalah slug string (food, shop, dll) — bukan UUID
    slug = payload.category_id if payload.category_id in VALID_SLUGS else "other"
    imp  = is_impulsive(payload.amount, slug, date)

    txn = Transaction(
        id=uuid.uuid4(),
        amount=payload.amount,
        type=payload.type,
        description=payload.description,
        date=date,
        is_impulsive=imp,
        category_id=None,       # UUID foreign key — tidak dipakai
        category_slug=slug,     # simpan slug di sini
        user_id=current_user.id
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn

@router.delete("/{id}")
def delete_transaction(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    txn = db.query(Transaction).filter(
        Transaction.id == id,
        Transaction.user_id == current_user.id
    ).first()
    if txn:
        db.delete(txn)
        db.commit()
    return {"message": "deleted"}