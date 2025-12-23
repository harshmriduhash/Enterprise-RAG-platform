
# Enterprise RAG Platform
### Knowledge-as-API for Production LLM Systems

## What This Is
A production-grade Retrieval-Augmented Generation (RAG) platform that exposes company knowledge as a secure, multi-tenant API.
This is LLM infrastructure, not a chat app.

## Key Capabilities
- User signup / signin (JWT-based auth)
- Multi-tenant isolation
- API key management (machine access)
- Hybrid retrieval (vector + keyword)
- Citations, confidence scoring
- Cost tracking & eval harness

## Architecture
Client → Auth (JWT + API Key) → RAG Core → Vector DB / Search → LLM → Response

## Auth Model
- Users authenticate via email/password (JWT)
- Each signup creates a Tenant
- RBAC: Admin / Operator / Viewer
- API keys layered on top for services

## Tech Stack
FastAPI, Postgres, Qdrant, Redis, Celery, React, Tailwind

## Positioning
This platform exposes company knowledge as a secure, evaluatable API for LLM-powered systems.
