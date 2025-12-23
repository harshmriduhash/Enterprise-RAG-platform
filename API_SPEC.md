# API Spec — MVP

Auth
- `POST /signup` — create tenant + admin (returns JWT)
- `POST /signin` — returns JWT
- `POST /keys` — create API key (admin only)

Ingestion
- `POST /ingest` — multipart upload; accepts `file` and optional `metadata`. Returns `doc_id` and `status`.
- Ingestion pipeline: chunk -> embeddings -> store in vector DB (qdrant/FAISS)

Retrieval & RAG
- `POST /query`
  - Request: `{tenant_id, query, top_k=5, retriever: "hybrid"}`
  - Behavior: run vector search, optional keyword pass, gather candidates, call LLM with context, return answer + citations + confidence score
  - Response: `{answer: string, citations: [{doc_id, score, loc}], confidence: float}`

Observability
- Events logged: ingest_completed, query_received, llm_call, token_counts
- Admin UI exposes recent logs and per-tenant token/embedding counters

Errors
- 401 unauthorized
- 403 forbidden (tenant mismatch)
- 429 rate limit
- 500 internal error

Notes
- For MVP integrate a single hosted LLM (OpenAI or Anthropic) and a single vector DB (hosted Qdrant or local FAISS) to keep scope small.
- Keep tenant isolation enforced at DB + vector namespace layer.
