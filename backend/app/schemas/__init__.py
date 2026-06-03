from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

# ── User ─────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

# ── Token ─────────────────────────────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut