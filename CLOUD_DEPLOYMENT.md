# Deployment Guide — Vercel + Railway/Render

## Recommended Setup

- **Frontend**: Vercel (easiest for React/Vite)
- **Backend**: Railway or Render (Python/FastAPI)

---

## Option 1: Frontend on Vercel

### 1. Push frontend to GitHub
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Select `frontend/` as root directory
4. Add environment variable:
   - `VITE_API_BASE=https://your-backend-domain.com`
5. Click Deploy

**Result**: Frontend live on vercel domain

---

## Option 2A: Backend on Railway

### 1. Connect GitHub repo to Railway
1. Go to https://railway.app
2. Create new project → GitHub
3. Select your repo

### 2. Configure backend
1. In Railway dashboard, create service
2. Select Python from marketplace
3. Point to `backend/` folder
4. Add environment variables:
   ```
   MVP_JWT_SECRET=<random-secret>
   OPENAI_API_KEY=sk-...
   ```
5. Set start command in Railway:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### 3. Get domain
- Railway generates a public URL automatically
- Update frontend's `VITE_API_BASE` to this URL

---

## Option 2B: Backend on Render

### 1. Connect GitHub repo to Render
1. Go to https://render.com
2. Create new → Web Service
3. Connect GitHub repo
4. Select `backend/` as root directory

### 2. Configure backend
1. Runtime: Python 3.10
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   ```
   MVP_JWT_SECRET=<random-secret>
   OPENAI_API_KEY=sk-...
   ```

### 3. Get domain
- Render generates a public URL
- Update frontend's `VITE_API_BASE` to this URL

---

## Option 3: Full Stack on Railway/Render

If you want both frontend and backend on the same platform:

### Railway
1. Create two services in same project:
   - Service 1: Backend (Python)
   - Service 2: Frontend (Node.js + npm run build)
2. Link services via internal network
3. Set VITE_API_BASE to backend service URL

### Render
Similar setup: Create two services, configure networking

---

## Comparison

| Platform | Frontend | Backend | Cost | Notes |
|----------|----------|---------|------|-------|
| **Vercel** | ⭐⭐⭐ Excellent | ❌ No Python | Free tier | Best for frontend-only |
| **Railway** | ⭐⭐ Good | ⭐⭐⭐ Excellent | $5/month min | Good all-in-one |
| **Render** | ⭐⭐ Good | ⭐⭐⭐ Excellent | Free tier | Good all-in-one |

---

## Quick Deploy Checklist

### Before deploying:
- [ ] Push code to GitHub (public or private repo)
- [ ] Create `.env` with secrets (don't commit!)
- [ ] Test locally: `docker compose up -d`

### Frontend (Vercel):
- [ ] Go to vercel.com/new
- [ ] Import repo
- [ ] Set `VITE_API_BASE` env var
- [ ] Deploy

### Backend (Railway):
- [ ] Go to railway.app
- [ ] Create project from GitHub
- [ ] Configure Python service
- [ ] Add env vars (MVP_JWT_SECRET, OPENAI_API_KEY)
- [ ] Deploy

### Backend (Render):
- [ ] Go to render.com
- [ ] Create Web Service from GitHub
- [ ] Select backend/ folder
- [ ] Configure build/start commands
- [ ] Add env vars
- [ ] Deploy

### Final Step:
- [ ] Update frontend `VITE_API_BASE` to point to deployed backend
- [ ] Test signup/ingest/query flows

---

## Database Persistence

**Important**: SQLite stored in app filesystem won't persist across restarts on serverless platforms.

### Solution 1: Add PostgreSQL (recommended)
```bash
# Install on Railway/Render
# Update backend connection string
DATABASE_URL=postgresql://user:pass@host:5432/rag
```

### Solution 2: Use Docker (persistent volume)
- Stick with docker-compose locally
- Or use Railway/Render's container deployment

---

## Environment Variables to Set

```
MVP_JWT_SECRET=<random-32-char-secret>
OPENAI_API_KEY=sk-your-key
DATABASE_URL=<if-using-postgres>
RATE_LIMIT_PER_MINUTE=60
```

---

## Troubleshooting

**Frontend build fails:**
- Check Node version: `node --version` (should be 18+)
- Delete `node_modules`, run `npm install` again

**Backend won't start:**
- Check Python version: `python --version` (should be 3.10+)
- Verify all env vars are set
- Check logs in platform dashboard

**CORS errors:**
- Verify `VITE_API_BASE` matches actual backend domain
- Check backend CORS config allows frontend domain

---

**Recommended**: Use Vercel + Railway combo for fastest, most reliable deploy.
