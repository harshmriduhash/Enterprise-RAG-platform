# Environment config for MVP — set before running

import os
from dotenv import load_dotenv

load_dotenv()

# Secrets
SECRET = os.environ.get("MVP_JWT_SECRET", "dev-secret-change-in-prod")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# Database
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./rag_mvp.db")

# Rate limiting
RATE_LIMIT_ENABLED = os.environ.get("RATE_LIMIT_ENABLED", "true").lower() == "true"
RATE_LIMIT_PER_MINUTE = int(os.environ.get("RATE_LIMIT_PER_MINUTE", "60"))

# CORS
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

print(f"[CONFIG] RATE_LIMIT_ENABLED={RATE_LIMIT_ENABLED}, OPENAI_KEY={'set' if OPENAI_API_KEY else 'not set'}")
