from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, Token
from app.config import settings
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os, uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])

SECRET_KEY       = settings.SECRET_KEY
ALGORITHM        = settings.ALGORITHM
ACCESS_EXPIRE    = settings.ACCESS_TOKEN_EXPIRE_MINUTES
GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ── helpers ──────────────────────────────────────────────────────────────────

def hash_password(pw: str) -> str:
    return pwd_ctx.hash(pw)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_EXPIRE)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token tidak valid")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    return user


# ── register ─────────────────────────────────────────────────────────────────

@router.post("/register", response_model=Token)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    user = User(
        id       = uuid.uuid4(),
        name     = payload.name,
        email    = payload.email,
        password = hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user": user}


# ── login (email/password) ────────────────────────────────────────────────────

@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not user.password or not verify_password(form.password, user.password):
        raise HTTPException(status_code=401, detail="Email atau password salah")
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user": user}


# ── Google OAuth2 ─────────────────────────────────────────────────────────────

@router.post("/google", response_model=Token)
def google_auth(payload: dict, db: Session = Depends(get_db)):
    """
    Terima { credential: <google_id_token> } dari frontend (Google One Tap / Sign-In).
    Verifikasi token, cari / buat user, kembalikan JWT.
    """
    credential = payload.get("credential")
    if not credential:
        raise HTTPException(status_code=400, detail="credential wajib diisi")

    try:
        info = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
        )
    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Token Google tidak valid: {e}")

    google_id  = info["sub"]
    email      = info.get("email", "")
    name       = info.get("name", email.split("@")[0])
    avatar_url = info.get("picture")

    # Cari berdasarkan google_id dulu, lalu email
    user = (
        db.query(User).filter(User.google_id == google_id).first()
        or db.query(User).filter(User.email == email).first()
    )

    if user:
        # Update data Google jika belum tersimpan
        user.google_id  = user.google_id or google_id
        user.avatar_url = user.avatar_url or avatar_url
    else:
        user = User(
            id         = uuid.uuid4(),
            name       = name,
            email      = email,
            password   = None,       # tidak punya password lokal
            google_id  = google_id,
            avatar_url = avatar_url,
        )
        db.add(user)

    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user": user}


# ── me ────────────────────────────────────────────────────────────────────────

@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return current_user