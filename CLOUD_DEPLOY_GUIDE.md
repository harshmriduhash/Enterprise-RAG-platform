# 🚀 Deployment on Vercel + Railway/Render

**Status:** ✅ Frontend ready to deploy  
**Building:** Backend dependencies installing

---

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend) — RECOMMENDED
- Frontend: Instant global CDN, free tier
- Backend: Python/FastAPI support, free tier ($5/month after)
- Total cost: Free or ~$5/month

### Option 2: Vercel (Frontend) + Render (Backend)
- Frontend: Same as above
- Backend: Similar to Railway, free tier with limitations
- Total cost: Free or ~$7/month

### Option 3: Railway Full Stack
- Both frontend and backend on same platform
- Easier to manage, private networking
- Total cost: ~$5/month

---

## Step 1: Push to GitHub (5 min)

```powershell
cd "e:\AI Infra products\Enterprise RAG platform"
git init
git add .
git commit -m "Enterprise RAG MVP - Ready for launch"
git remote add origin https://github.com/your-username/rag-mvp.git
git push -u origin main
```

---

## Step 2: Deploy Frontend on Vercel (5 min)

1. Go to https://vercel.com/new
2. Connect GitHub account
3. Select your `rag-mvp` repo
4. **Important:** In Settings:
   - Root Directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add environment variable:
   - Key: `VITE_API_BASE`
   - Value: `https://your-backend-domain.railway.app` (fill after backend is deployed)
6. Click **Deploy**

**Result:** Your frontend is live at `https://your-project.vercel.app`

---

## Step 3: Deploy Backend on Railway (10 min)

### 3A. Create Railway Project
1. Go to https://railway.app
2. Click "Create New Project"
3. Select "GitHub Repo"
4. Authenticate and select your `rag-mvp` repo

### 3B. Configure Python Service
1. In Railway dashboard, add service
2. Select Python from marketplace
3. In service settings:
   - **Root Directory:** `backend`
   - **Python Version:** 3.10
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3C: Add Environment Variables
In Railway dashboard, set:
```
MVP_JWT_SECRET=<generate-random-32-char-secret>
OPENAI_API_KEY=sk-your-openai-api-key
RATE_LIMIT_PER_MINUTE=60
```

### 3D: Deploy
- Railway auto-deploys from GitHub
- Wait ~3 minutes for build to complete
- Get public URL from Railway dashboard

### 3E: Update Frontend
- Go back to Vercel
- Update `VITE_API_BASE` env var with Railway backend URL
- Vercel auto-redeploys

**Result:** Your backend is live at `https://rag-mvp-prod.railway.app`

---

## Step 4: Test End-to-End (5 min)

1. Go to frontend: https://your-project.vercel.app
2. Signup: `admin@test.com` / `TestPass123`
3. Create API key
4. Upload `demo/manual.md`
5. Query: "What is the SLA for backups?"
6. Verify response includes answer + citations

---

## Alternative: Backend on Render (Instead of Railway)

### 1. Create Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Select GitHub repo

### 2. Configure
- **Name:** `rag-mvp-backend`
- **Root Directory:** `backend`
- **Runtime:** Python 3.10
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. Add Env Vars
Same as Railway (MVP_JWT_SECRET, OPENAI_API_KEY)

### 4. Deploy
Click "Create Web Service" and wait 5 minutes

---

## Full-Stack on Railway (Both Frontend & Backend)

If you want both on Railway:

### 1. Create Two Services
- Service 1: Backend (Python, see Step 3B)
- Service 2: Frontend (Node.js)

### 2. Frontend Service Config
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Start Command:** `npm run preview`
- **Port:** 5173

### 3. Link Services
- In Railway dashboard, link services
- Frontend env var: `VITE_API_BASE=http://backend:8000` (internal networking)

---

## Important: Database Persistence

**⚠️ SQLite won't persist** across platform restarts (lost data).

### Solution: Migrate to PostgreSQL

Railway/Render both offer free PostgreSQL:

1. Add PostgreSQL service in Railway/Render dashboard
2. Get connection string
3. Update backend `requirements.txt`:
   ```
   psycopg2-binary==2.9.9
   ```
4. Update `backend/main.py`:
   ```python
   from sqlalchemy import create_engine
   DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./rag.db")
   engine = create_engine(DATABASE_URL)
   ```
5. Set env var: `DATABASE_URL=postgresql://user:pass@host:5432/rag`
6. Redeploy

---

## Troubleshooting

### Frontend build fails on Vercel
- Check Node version in Vercel settings (should be 18+)
- Verify `vite.config.js` exists
- Check build command: `npm run build`

### Backend fails to start on Railway/Render
- Check Python version (should be 3.10)
- Verify all env vars are set
- Check logs in platform dashboard
- Verify `Procfile` exists in root

### CORS errors
- Update `VITE_API_BASE` in frontend env vars
- Make sure backend CORS allows frontend domain
- Check `docker-compose.yml` CORS config

### Database errors
- If using SQLite, data will be lost on restart
- Migrate to PostgreSQL for production
- See "Database Persistence" section above

---

## Cost Summary

| Service | Tier | Cost |
|---------|------|------|
| Vercel (Frontend) | Free | $0 |
| Railway (Backend) | Starter | $5/month + usage |
| Railway (Database) | Free tier | $0 |
| **Total** | | **~$5/month** |

Alternative (Render):
- Render (Backend) Free tier = $0 first month, then $7/month
- Render (Database) Free tier = $0
- **Total = Free or $7+**

---

## Post-Deployment

1. **Monitor logs:**
   - Railway: Dashboard → Service → Logs
   - Render: Service → Logs

2. **Set up alerts:**
   - Railway: Incidents & Alerts
   - Render: Email notifications

3. **Backup database:**
   - Export SQLite: `sqlite3 mvp.sqlite3 ".backup mvp_backup.db"`
   - Or use PostgreSQL built-in backups

4. **Scale if needed:**
   - Railway: Adjust compute in service settings
   - Render: Upgrade instance type

---

## Launch Checklist

- [ ] Push code to GitHub
- [ ] Deploy frontend on Vercel (5 min)
- [ ] Deploy backend on Railway/Render (10 min)
- [ ] Get backend URL from platform
- [ ] Update frontend `VITE_API_BASE` env var
- [ ] Wait for frontend redeploy (1-2 min)
- [ ] Test signup/ingest/query flows
- [ ] Send to pilots with frontend URL

---

**Recommended:** Use Vercel + Railway combo. Cheapest, most reliable, fastest setup.

**Time to launch: 30 minutes total**
