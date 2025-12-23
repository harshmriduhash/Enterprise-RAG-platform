# Enterprise RAG Platform — MVP

Knowledge-as-API for Production LLM Systems — production-ready MVP.

A secure, multi-tenant RAG API platform that exposes private knowledge as a queryable API with built-in observability, usage tracking, and LLM-powered answer generation.

## Quick Start (5 min)

### Local Development
```bash
# Backend (Terminal 1)
cd backend
python -m venv .venv
# On Windows:
.\.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (Terminal 2)
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Docker (One-Command Deploy)
```bash
docker compose up -d
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

## Product Overview

### What It Does
- **Multi-tenant RAG API** — expose private knowledge to AI systems via secure API
- **Retrieval + Generation** — hybrid vector+keyword search + OpenAI LLM integration
- **Usage Metering** — per-tenant token counters, query logs, CSV export
- **Admin Dashboard** — React UI to manage tenants, ingest documents, view analytics

### Core Flows
1. **Signup** → Tenant created, admin JWT token issued
2. **Create API Key** → Service auth for programmatic access
3. **Ingest** → Upload Markdown/PDF; auto-chunked and indexed (TF-IDF)
4. **Query** → `POST /query` → retrieval + LLM generation + citations
5. **Admin** → View docs, export usage CSV, manage keys

## Architecture

```
Client (API Key) 
  ↓
FastAPI Backend (Port 8000)
  ├─ Auth: JWT + API Keys
  ├─ Ingest: Markdown chunking + TF-IDF indexing
  ├─ Query: Hybrid retrieval + OpenAI LLM
  ├─ Admin: Tenant/doc/usage endpoints
  └─ Persistence: SQLite (auto-backup via volume)
  
React Admin UI (Port 5173)
  ├─ Signup/Signin
  ├─ Key management
  ├─ Doc ingestion
  └─ Analytics (CSV export)
```

## File Structure
```
.
├── backend/
│   ├── main.py              # FastAPI app (auth, ingest, query, admin)
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile           # Docker image
├── frontend/
│   ├── src/App.jsx          # React admin UI
│   ├── src/api.js           # Backend API client
│   ├── package.json         # npm dependencies
│   └── Dockerfile           # Docker image
├── demo/
│   └── manual.md            # Sample knowledge base
├── docker-compose.yml       # Local dev/test stack
├── deploy.sh                # Linux VM deployment script
├── LANDING.md               # Product positioning page
├── QUICKSTART.md            # API examples (curl)
├── PILOT_EMAIL.md           # Outreach template
├── PRICING_ONE_PAGER.md     # Pilot pricing
├── DEPLOYMENT.md            # Production deploy guide
├── LAUNCH_CHECKLIST.md      # Go-live checklist
└── .env.example             # Environment variables template
```

## Key Features

✅ **Authentication**
- JWT signup/signin for admins
- API keys for service-to-service
- Rate limiting (10/min signup, 30/min query)

✅ **Multi-Tenancy**
- Strict tenant isolation at DB layer
- Per-tenant API keys and data
- Tenant ID enforcement on all queries

✅ **Document Ingestion**
- Markdown/text file upload
- Auto-chunking (split by double newline)
- TF-IDF + vector indexing

✅ **RAG Query**
- Hybrid retrieval (vector + keyword)
- OpenAI GPT-3.5-turbo integration (optional)
- Confidence scoring, citations with chunk IDs

✅ **Observability**
- Per-tenant query/token counters
- Admin CSV export
- Request logs, latency tracking

✅ **Deployment**
- Docker + docker-compose
- Systemd service for Linux VMs
- SQLite persistence (survives restarts)
- CORS-enabled for frontend

## API Overview

### Auth
- `POST /signup` — register org + admin
- `POST /signin` — admin login
- `POST /keys` — create API key (admin)

### Data
- `POST /ingest` — upload document
- `POST /query` — retrieve + generate answer
- `GET /admin/documents` — list tenant docs
- `GET /admin/usage_csv` — export metrics

### Health
- `GET /status` — system status

Full API spec: [API_SPEC.md](API_SPEC.md)

## Deployment

### Production (Linux VM)
```bash
bash deploy.sh
```
This installs Docker, builds images, and runs as systemd service.

### Pre-Deployment Setup
1. Copy `.env.example` → `.env`
2. Set `MVP_JWT_SECRET` (strong random string)
3. Set `OPENAI_API_KEY` (your OpenAI key)
4. Run `bash deploy.sh`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide.

## Sales & Positioning

- **Target Buyer:** CTO, Head of AI, Platform Engineering Lead
- **Positioning:** Infrastructure, not an app (capacity, reliability, risk reduction)
- **Pilot Offer:** ₹75k setup + usage-based billing (see [PRICING_ONE_PAGER.md](PRICING_ONE_PAGER.md))
- **Outreach:** [PILOT_EMAIL.md](PILOT_EMAIL.md) template ready to send

See [enterprise-rag-platform.md](enterprise-rag-platform.md) and [rag-monetization.md](rag-monetization.md) for full positioning.

## Demo

Sample knowledge base at `demo/manual.md`:
```
Query: "What is the SLA for backups?"
Answer: "Backups run daily at 02:00 UTC; RTO 4 hours, RPO 1 hour."
```

Ingest via admin UI or curl, then query via API.

## Next Steps

1. **Local Test** — run `docker compose up -d` and test signup/ingest/query flows
2. **Set Secrets** — update `.env` with real keys
3. **Deploy** — `bash deploy.sh` to Linux VM
4. **Send Pilots** — use [PILOT_EMAIL.md](PILOT_EMAIL.md) to reach out
5. **Collect Feedback** — monitor logs, iterate on features

## Support & Documentation

- [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) — pre/post-launch tasks
- [DEPLOYMENT.md](DEPLOYMENT.md) — production deploy guide
- [QUICKSTART.md](QUICKSTART.md) — API examples
- [API_SPEC.md](API_SPEC.md) — detailed endpoint reference

---

**Built for launch in 24 hours. Ready for pilot pilots and scale.**
