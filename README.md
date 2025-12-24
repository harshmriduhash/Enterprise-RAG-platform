```markdown
# Enterprise RAG Platform — MVP

Lightweight RAG (retrieval-augmented generation) platform scaffold and launch artifacts for a rapid MVP.

Status (what's implemented):
- A minimal FastAPI backend with authentication, ingest, query, and admin endpoints (see `backend/`).
- A Vite + React admin UI for tenant/admin flows (see `frontend/`).
- Docs and launch artifacts: `API_SPEC.md`, `QUICKSTART.md`, `LANDING.md`, and outreach assets.

Quick start (dev):

- Backend (Windows PowerShell):

```powershell
cd "e:\AI Infra products\Enterprise RAG platform\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

- Frontend (dev server):

```bash
cd frontend
npm install
npm run dev
```

Project layout:
- `backend/` — FastAPI app, `main.py`, `db.py`, and Dockerfile.
- `frontend/` — Vite + React admin UI, components and pages.
- `API_SPEC.md`, `QUICKSTART.md` — API contract and quick examples.
- `LANDING.md`, `PRICING_ONE_PAGER.md`, `PILOT_EMAIL.md` — product & go-to-market assets.

Notes & next steps:
- Current MVP uses an in-memory store and TF-IDF retrieval for simplicity. For production, add a vector DB (Qdrant/FAISS) and LLM integration.
- Consider containerizing both services (Dockerfiles exist) and adding a docker-compose or cloud deployment per `CLOUD_DEPLOYMENT.md`.

```
# Enterprise RAG Platform — MVP Assets

This folder contains launch artifacts for a 24-hour MVP launch:
- `LANDING.md` — one-page product positioning
- `QUICKSTART.md` — minimal API examples and curl commands
- `API_SPEC.md` — concise API surface for engineers
- `PILOT_EMAIL.md` — outreach template for target customers
- `PRICING_ONE_PAGER.md` — pilot pricing and conversion plan

Next steps (suggested):
- Scaffold the FastAPI backend and routes from `API_SPEC.md`.
- Prepare demo dataset (Markdown) and ingest using `QUICKSTART.md` flow.
- Deploy to a lightweight VM or cloud function and publish `LANDING.md` as the public page.
