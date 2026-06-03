# backend/app/routers/finbot_routers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import uuid, json, datetime

from app.database import get_db
from app.models import ChatSession
from app.routers.auth import get_current_user
from app.services.finbot import get_finbot_reply

router = APIRouter(prefix="/api/finbot", tags=["FinBot"])

# ── Pydantic Schemas ─────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str
    content: str

class FinBotContext(BaseModel):
    userName:         str   = "Pengguna"
    dnaType:          str   = "Balanced Planner"
    dna:              float = 72.0
    balance:          float = 0
    income:           float = 0
    expense:          float = 0
    impsCount:        int   = 0
    impAmt:           float = 0
    txnCount:         int   = 0
    predictedBalance: Optional[float] = None
    riskLevel:        str   = "low"

class FinBotRequest(BaseModel):
    messages:   list[ChatMessage]
    context:    FinBotContext
    session_id: Optional[str] = None   # UUID sesi yang sedang aktif

class SessionCreate(BaseModel):
    title: str = "Sesi Baru"

class SessionUpdate(BaseModel):
    title:    Optional[str]             = None
    messages: Optional[list[ChatMessage]] = None

# ── Helper ───────────────────────────────────────────────────────────────────

def _serialize(session: ChatSession) -> dict:
    return {
        "id":         str(session.id),
        "title":      session.title,
        "messages":   json.loads(session.messages or "[]"),
        "created_at": session.created_at.isoformat(),
        "updated_at": session.updated_at.isoformat() if session.updated_at else session.created_at.isoformat(),
    }

# ── Chat (kirim pesan + simpan ke DB) ────────────────────────────────────────

@router.post("")
async def chat(
    body: FinBotRequest,
    db:   Session = Depends(get_db),
    current_user  = Depends(get_current_user)
):
    msgs  = [m.dict() for m in body.messages]
    ctx   = body.context.dict()
    reply = get_finbot_reply(msgs, ctx)

    # Simpan pesan ke sesi yang aktif (kalau ada session_id)
    if body.session_id:
        try:
            sid = uuid.UUID(body.session_id)
            session = db.query(ChatSession).filter(
                ChatSession.id      == sid,
                ChatSession.user_id == current_user.id
            ).first()
            if session:
                existing = json.loads(session.messages or "[]")
                # Tambah pesan user + reply bot
                user_msg = msgs[-1] if msgs else None
                if user_msg and user_msg["role"] == "user":
                    existing.append({"role":"user",    "content": user_msg["content"]})
                existing.append(    {"role":"assistant","content": reply})
                session.messages   = json.dumps(existing, ensure_ascii=False)
                session.updated_at = datetime.datetime.utcnow()
                # Update title dari pesan pertama user jika masih "Sesi Baru"
                if session.title == "Sesi Baru" and user_msg:
                    session.title = user_msg["content"][:50]
                db.commit()
        except Exception:
            pass   # Jangan crash kalau penyimpanan gagal

    return {"reply": reply}

# ── CRUD Sesi ─────────────────────────────────────────────────────────────────

@router.get("/sessions")
def get_sessions(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.updated_at.desc()).all()
    return [_serialize(s) for s in sessions]


@router.post("/sessions")
def create_session(
    body: SessionCreate,
    db:   Session = Depends(get_db),
    current_user  = Depends(get_current_user)
):
    session = ChatSession(
        id       = uuid.uuid4(),
        user_id  = current_user.id,
        title    = body.title,
        messages = "[]",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return _serialize(session)


@router.put("/sessions/{session_id}")
def update_session(
    session_id: str,
    body: SessionUpdate,
    db:   Session = Depends(get_db),
    current_user  = Depends(get_current_user)
):
    session = db.query(ChatSession).filter(
        ChatSession.id      == uuid.UUID(session_id),
        ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sesi tidak ditemukan")

    if body.title is not None:
        session.title = body.title
    if body.messages is not None:
        session.messages   = json.dumps([m.dict() for m in body.messages], ensure_ascii=False)
        session.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(session)
    return _serialize(session)


@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    session = db.query(ChatSession).filter(
        ChatSession.id      == uuid.UUID(session_id),
        ChatSession.user_id == current_user.id
    ).first()
    if session:
        db.delete(session)
        db.commit()
    return {"message": "deleted"}


@router.get("/health")
async def health():
    return {"status": "ok"}