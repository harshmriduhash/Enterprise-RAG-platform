# Deployment — Enterprise RAG MVP

## Local Dev (Docker Compose)

```bash
cd "e:\AI Infra products\Enterprise RAG platform"
docker compose up -d
```

Backend: http://localhost:8000
Frontend: http://localhost:5173

## Linux VM Deployment (Ubuntu 22.04+)

```bash
bash deploy.sh
```

This script:
- Installs Docker & Docker Compose
- Builds both backend and frontend images
- Runs containers with persistent data volume
- Sets up systemd auto-start service
- Exposes backend on port 8000, frontend on port 5173

## Environment Variables

Create `.env` file in project root before deployment:

```
MVP_JWT_SECRET=your-production-secret-key-here
OPENAI_API_KEY=sk-your-openai-key-here
RATE_LIMIT_PER_MINUTE=60
```

Or update `docker-compose.yml` directly.

## Security Notes

For production:
1. Change `MVP_JWT_SECRET` to a strong random string
2. Set `OPENAI_API_KEY` to your API key
3. Use nginx reverse proxy with SSL/TLS
4. Enable rate limiting (default 10/min signup, 30/min query)
5. Back up SQLite DB (`mvp.sqlite3`) regularly
6. Monitor logs: `docker logs rag-mvp-backend`

## Troubleshooting

```bash
# View logs
docker logs rag-mvp-backend
docker logs rag-mvp-frontend

# Restart
docker compose restart

# Stop
docker compose down

# Remove data (⚠️ destructive)
docker volume rm rag-mvp_rag-data
```
