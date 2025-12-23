# Quickstart — Enterprise RAG Platform (MVP)

This quickstart shows the minimal API surface for the MVP. Replace `https://mvp.example.com` with your deployed host.

1) Signup

POST /signup

Request JSON:
{
  "org_name": "Acme Corp",
  "admin_email": "admin@acme.com",
  "password": "StrongPass!"
}

Response:
{
  "tenant_id": "tenant_abc",
  "admin_token": "<jwt-token>"
}

curl example:

```bash
curl -X POST https://mvp.example.com/signup \
  -H "Content-Type: application/json" \
  -d '{"org_name":"Acme","admin_email":"admin@acme.com","password":"Pass1234"}'
```

2) Create API key (admin)

POST /keys
Headers: `Authorization: Bearer <admin_token>`

Request JSON:
{ "name": "service-key-1" }

Response:
{ "api_key": "sk_..." }

3) Ingest (one file, markdown)

POST /ingest
Headers: `Authorization: ApiKey <sk_...>`

Request multipart/form-data: `file=@docs/manual.md`

Response:
{ "status":"ingested","doc_id":"doc_123" }

4) Query

POST /query
Headers: `Authorization: ApiKey <sk_...>`

Request JSON:
{
  "tenant_id": "tenant_abc",
  "query": "What is the SLA for backups?",
  "top_k": 5
}

Response JSON:
{
  "answer": "Backups run daily at 02:00; RTO 4 hours.",
  "citations": [ {"doc_id":"doc_123","loc":"p.2"} ],
  "confidence": 0.87
}

5) Billing / Usage
- Token usage and embeddings generated are recorded per tenant.
- For pilots use manual invoicing: export usage CSV from admin UI.
