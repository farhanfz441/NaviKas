from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import uuid, datetime

class User(Base):
    __tablename__ = "users"
    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name           = Column(String(100), nullable=False)
    email          = Column(String(255), unique=True, nullable=False, index=True)
    password       = Column(String(255), nullable=True)         
    google_id      = Column(String(255), nullable=True, unique=True, index=True) 
    avatar_url     = Column(String(512), nullable=True)         
    is_premium     = Column(Boolean, default=False)
    budget         = Column(Float, default=0)
    gemini_api_key = Column(String(255), nullable=True)
    created_at     = Column(DateTime, default=datetime.datetime.utcnow)
    transactions   = relationship("Transaction", back_populates="user", cascade="all,delete")
    predictions    = relationship("Prediction",  back_populates="user", cascade="all,delete")
    chat_sessions  = relationship("ChatSession", back_populates="user", cascade="all,delete")

class Category(Base):
    __tablename__ = "categories"
    id    = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name  = Column(String(100), nullable=False)
    icon  = Column(String(10))
    color = Column(String(20))
    transactions = relationship("Transaction", back_populates="category")

class Transaction(Base):
    __tablename__ = "transactions"
    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id        = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    category_id    = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    category_slug  = Column(String(50), nullable=True)
    amount         = Column(Float, nullable=False)
    type           = Column(Enum("income","expense", name="txn_type"), nullable=False)
    description    = Column(String(255))
    is_impulsive   = Column(Boolean, default=False)
    date           = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    created_at     = Column(DateTime, default=datetime.datetime.utcnow)
    user           = relationship("User", back_populates="transactions")
    category       = relationship("Category", back_populates="transactions")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title      = Column(String(255), default="Sesi Baru")
    messages   = Column(String, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    user       = relationship("User", back_populates="chat_sessions")

class Prediction(Base):
    __tablename__ = "predictions"
    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id           = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    month             = Column(String(7))
    predicted_balance = Column(Float)
    risk_level        = Column(Enum("low","medium","high", name="risk_level"))
    dna_score         = Column(Float)
    impulse_count     = Column(Integer, default=0)
    created_at        = Column(DateTime, default=datetime.datetime.utcnow)
    user              = relationship("User", back_populates="predictions")