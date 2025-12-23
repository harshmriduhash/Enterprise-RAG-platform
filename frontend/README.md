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
