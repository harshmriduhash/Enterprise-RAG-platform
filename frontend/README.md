```markdown
# Admin UI — Enterprise RAG Platform (MVP)

Minimal admin UI (Vite + React) for tenant/admin flows: signup/signin, API key creation, file ingest, document listing, and usage export.

Dev run:

```bash
cd frontend
npm install
npm run dev
```

Environment:
- The UI expects the backend at `http://localhost:8000` by default. To change, set `VITE_API_BASE` in a `.env` file (e.g. `VITE_API_BASE=http://localhost:8000`).

Features:
- Signup / Signin (admin)
- Create API key
- Upload / ingest a markdown file
- List ingested document chunks
- Download usage CSV

Build for production:

```bash
cd frontend
npm run build
```

Notes:
- The UI is minimal and intended for demo/pilot. For production, add proper input validation, error handling, and auth session persistence.

```
# Admin UI — Enterprise RAG Platform (MVP)

Dev run:

```bash
cd frontend
npm install
npm run dev
```

The UI assumes backend is at `http://localhost:8000`. To change, set `VITE_API_BASE` in `.env`.

Features:
- Signup / Signin (admin)
- Create API key
- Upload/ingest a markdown file
- List ingested document chunks
- Download usage CSV
