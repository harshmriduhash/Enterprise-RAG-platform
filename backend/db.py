from sqlalchemy import create_engine, Column, String, Integer, JSON, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

DATABASE_URL = "sqlite:///./rag_mvp.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class TenantRecord(Base):
    __tablename__ = "tenants"
    tenant_id = Column(String, primary_key=True)
    org_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserRecord(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    tenant_id = Column(String)
    role = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class APIKeyRecord(Base):
    __tablename__ = "api_keys"
    api_key = Column(String, primary_key=True)
    name = Column(String)
    tenant_id = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class DocumentRecord(Base):
    __tablename__ = "documents"
    chunk_id = Column(String, primary_key=True)
    doc_id = Column(String)
    tenant_id = Column(String)
    text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class UsageRecord(Base):
    __tablename__ = "usage"
    tenant_id = Column(String, primary_key=True)
    queries = Column(Integer, default=0)
    tokens = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
