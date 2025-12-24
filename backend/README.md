```markdown
# Backend — MVP (FastAPI)

Purpose: minimal FastAPI backend for the MVP with tenant/admin auth, ingest, query, and simple usage export.

Prerequisites:
- Python 3.9+ (Windows example below)

Run locally (Windows PowerShell):

```powershell
cd "e:\AI Infra products\Enterprise RAG platform\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Auth & endpoints (summary):
- `POST /signup` — create tenant + admin token
- `POST /signin` — sign in and obtain tokens
- `POST /keys` — create API key (admin bearer token required)
- `POST /ingest` — multipart upload `file` (ApiKey or admin token)
- `POST /query` — run query (ApiKey auth supported)

Admin endpoints (admin JWT required):
- `GET /admin/tenants` — view tenant info
- `GET /admin/documents` — list ingested documents for your tenant
- `GET /admin/usage_csv` — export usage CSV for your tenant

Example: export usage CSV (PowerShell)

```powershell
curl -X GET http://localhost:8000/admin/usage_csv -H "Authorization: Bearer <admin_token>" -o usage.csv
```

Notes:
- This MVP uses an in-memory store and TF-IDF retrieval for simplicity; swap for a vector DB (Qdrant/FAISS) for production.
- A Dockerfile exists for containerization; adjust env vars before production.

```
# Backend — MVP (FastAPI)

Run locally (Windows PowerShell):

```powershell
cd "e:\AI Infra products\Enterprise RAG platform\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Endpoints:
- `POST /signup` — create tenant + admin token
- `POST /signin` — signin
- `POST /keys` — create API key (admin bearer token required)
- `POST /ingest` — multipart upload `file` (ApiKey or admin token)
- `POST /query` — run query (ApiKey auth supported)

Admin endpoints (admin JWT required):
- `GET /admin/tenants` — view tenant info for your tenant
- `GET /admin/documents` — list documents ingested for your tenant
- `GET /admin/usage_csv` — export usage CSV for your tenant

Example: export usage CSV (PowerShell)
```powershell
curl -X GET http://localhost:8000/admin/usage_csv -H "Authorization: Bearer <admin_token>" -o usage.csv
```

Notes:
- This MVP uses an in-memory store and TF-IDF based retrieval to avoid external deps.
- For real usage replace vector store with Qdrant/FAISS and add an LLM integration.
