from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import io
import csv
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import uuid
import os
import jwt
from passlib.context import CryptContext
from typing import Optional, List, Dict, Any
import sqlite3
from sqlite3 import Connection
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import requests

SECRET = os.environ.get("MVP_JWT_SECRET", "change-me-for-prod")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
DB_PATH = os.environ.get("MVP_DB", os.path.join(os.getcwd(), "mvp.sqlite3"))

# Simple SQLite persistence for MVP
def get_db_conn() -> Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS tenants(
            tenant_id TEXT PRIMARY KEY, org_name TEXT
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users(
            user_id TEXT PRIMARY KEY, email TEXT, password TEXT, tenant_id TEXT, role TEXT
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS api_keys(
            api_key TEXT PRIMARY KEY, name TEXT, tenant_id TEXT
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS documents(
            id INTEGER PRIMARY KEY AUTOINCREMENT, doc_id TEXT, tenant_id TEXT, chunk_id TEXT, text TEXT
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS usage_stats(
            tenant_id TEXT PRIMARY KEY, queries INTEGER DEFAULT 0, tokens INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

def load_persisted():
    conn = get_db_conn()
    cur = conn.cursor()
    # tenants
    for row in cur.execute('SELECT tenant_id, org_name FROM tenants'):
        tenants[row['tenant_id']] = {'org_name': row['org_name']}
    # users
    for row in cur.execute('SELECT user_id, email, password, tenant_id, role FROM users'):
        users[row['user_id']] = {'email': row['email'], 'password': row['password'], 'tenant_id': row['tenant_id'], 'role': row['role'], 'id': row['user_id']}
    # api_keys
    for row in cur.execute('SELECT api_key, name, tenant_id FROM api_keys'):
        api_keys[row['api_key']] = {'name': row['name'], 'tenant_id': row['tenant_id']}
    # documents
    for row in cur.execute('SELECT doc_id, tenant_id, chunk_id, text FROM documents ORDER BY id'):
        documents.append({'doc_id': row['doc_id'], 'tenant_id': row['tenant_id'], 'chunk_id': row['chunk_id'], 'text': row['text']})
    # usage
    for row in cur.execute('SELECT tenant_id, queries, tokens FROM usage_stats'):
        usage_stats[row['tenant_id']] = {'queries': int(row['queries']), 'tokens': int(row['tokens'])}
    conn.close()

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(title="Enterprise RAG Platform - MVP")

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    raise HTTPException(status_code=429, detail="Too many requests")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
security = HTTPBearer(auto_error=False)

# In-memory stores (MVP)
tenants: Dict[str, Dict[str, Any]] = {}
users: Dict[str, Dict[str, Any]] = {}
api_keys: Dict[str, Dict[str, Any]] = {}
documents: List[Dict[str, Any]] = []
vectorizer: Optional[TfidfVectorizer] = None
doc_matrix = None
usage_stats: Dict[str, Dict[str, int]] = {}

# Initialize DB and load persisted state
init_db()
load_persisted()
rebuild_vectors()

class SignupIn(BaseModel):
    org_name: str
    admin_email: str
    password: str

class SigninIn(BaseModel):
    email: str
    password: str

class KeyCreate(BaseModel):
    name: str

class QueryIn(BaseModel):
    tenant_id: str
    query: str
    top_k: Optional[int] = 3

# Utility

def create_jwt(payload: dict) -> str:
    return jwt.encode(payload, SECRET, algorithm="HS256")


def verify_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


def hash_pw(password: str) -> str:
    return pwd_ctx.hash(password)


def verify_pw(password: str, hashed: str) -> bool:
    return pwd_ctx.verify(password, hashed)

# Auth deps

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing auth")
    scheme = credentials.scheme.lower()
    token = credentials.credentials
    if scheme == "bearer":
        payload = verify_jwt(token)
        user_id = payload.get("sub")
        user = users.get(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid user")
        return user
    elif scheme == "apikey":
        key = api_keys.get(token)
        if not key:
            raise HTTPException(status_code=401, detail="Invalid API key")
        return {"tenant_id": key["tenant_id"], "role": "service"}
    else:
        raise HTTPException(status_code=401, detail="Unsupported auth scheme")

# Routes

@app.post("/signup")
@limiter.limit("10/minute")
def signup(request: Request, body: SignupIn):
    tenant_id = f"t_{uuid.uuid4().hex[:8]}"
    tenants[tenant_id] = {"org_name": body.org_name}
    user_id = f"u_{uuid.uuid4().hex[:8]}"
    users[user_id] = {
        "email": body.admin_email,
        "password": hash_pw(body.password),
        "tenant_id": tenant_id,
        "role": "admin",
        "id": user_id,
    }
    # persist
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute('INSERT OR REPLACE INTO tenants(tenant_id, org_name) VALUES (?, ?)', (tenant_id, body.org_name))
        cur.execute('INSERT OR REPLACE INTO users(user_id, email, password, tenant_id, role) VALUES (?, ?, ?, ?, ?)', (user_id, body.admin_email, users[user_id]['password'], tenant_id, 'admin'))
        conn.commit()
        conn.close()
    except Exception:
        pass
    token = create_jwt({"sub": user_id, "tenant_id": tenant_id, "role": "admin"})
    return {"tenant_id": tenant_id, "admin_token": token}

@app.post("/signin")
@limiter.limit("10/minute")
def signin(request: Request, body: SigninIn):
    for uid, u in users.items():
        if u["email"] == body.email and verify_pw(body.password, u["password"]):
            token = create_jwt({"sub": uid, "tenant_id": u["tenant_id"], "role": u["role"]})
            return {"token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/keys")
def create_key(body: KeyCreate, user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    key = f"sk_{uuid.uuid4().hex[:24]}"
    api_keys[key] = {"name": body.name, "tenant_id": user.get("tenant_id")}
    # persist api key
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute('INSERT OR REPLACE INTO api_keys(api_key, name, tenant_id) VALUES (?, ?, ?)', (key, body.name, user.get('tenant_id')))
        conn.commit()
        conn.close()
    except Exception:
        pass
    return {"api_key": key}

@app.post("/ingest")
async def ingest(file: UploadFile = File(...), metadata: Optional[str] = Form(None), user=Depends(get_current_user)):
    # Accept text/markdown files; read and split into passages
    if isinstance(user.get("tenant_id"), str):
        tenant_id = user.get("tenant_id")
    else:
        tenant_id = user.get("tenant_id")
    content_bytes = await file.read()
    try:
        text = content_bytes.decode("utf-8")
    except Exception:
        text = ""
    # Simple chunking: split by double newline
    chunks = [c.strip() for c in text.split('\n\n') if c.strip()]
    doc_id = f"doc_{uuid.uuid4().hex[:8]}"
    for i, chunk in enumerate(chunks):
        documents.append({
            "doc_id": doc_id,
            "tenant_id": tenant_id,
            "chunk_id": f"{doc_id}_c{i}",
            "text": chunk,
        })
    # persist chunks
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        for i, chunk in enumerate(chunks):
            cur.execute('INSERT INTO documents(doc_id, tenant_id, chunk_id, text) VALUES (?, ?, ?, ?)', (doc_id, tenant_id, f"{doc_id}_c{i}", chunk))
        conn.commit()
        conn.close()
    except Exception:
        pass
    # Recompute vectorizer over all tenant documents (MVP simplicity)
    rebuild_vectors(tenant_id)
    return {"status": "ingested", "doc_id": doc_id, "chunks": len(chunks)}

@app.post("/query")
@limiter.limit("30/minute")
def query(request: Request, body: QueryIn, user=Depends(get_current_user)):
    tenant_id = body.tenant_id
    if user.get("role") == "service":
        # api key user has tenant_id set
        if user.get("tenant_id") != tenant_id:
            raise HTTPException(status_code=403, detail="Tenant mismatch")
    # Basic retrieval using TF-IDF
    global vectorizer, doc_matrix
    if vectorizer is None or doc_matrix is None:
        raise HTTPException(status_code=500, detail="No documents indexed yet")
    # Filter docs belonging to tenant
    tenant_texts = [d["text"] for d in documents if d["tenant_id"] == tenant_id]
    tenant_idx_map = [i for i, d in enumerate(documents) if d["tenant_id"] == tenant_id]
    if not tenant_texts:
        return {"answer": "No documents found for tenant", "citations": [], "confidence": 0.0}
    q_vec = vectorizer.transform([body.query])
    # compute cosine similarities
    tenant_matrix = doc_matrix[tenant_idx_map]
    sims = (tenant_matrix @ q_vec.T).toarray().ravel()
    top_k = min(body.top_k, len(sims))
    top_indices = sims.argsort()[::-1][:top_k]
    citations = []
    answers = []
    scores = []
    for idx in top_indices:
        doc_global_idx = tenant_idx_map[idx]
        d = documents[doc_global_idx]
        citations.append({"doc_id": d["doc_id"], "chunk_id": d["chunk_id"], "text": d["text"][:300]})
        answers.append(d["text"])
        scores.append(float(sims[idx]))
    # Simple retrieval-aggregate answer
    retrieval_answer = "\n---\n".join(answers)
    # confidence: normalized top score by max possible (approx)
    max_score = max(scores) if scores else 0.0
    confidence = float(max_score / (max_score + 1.0))

    # If OPENAI_API_KEY present, call hosted LLM to generate a concise answer
    llm_response_text = None
    llm_tokens = 0
    if OPENAI_API_KEY:
        try:
            prompt_context = "\n\n".join([f"Passage: {a}" for a in answers])
            system_msg = "You are a helpful assistant. Use the provided passages to answer the user's question. Cite passages by chunk_id when relevant. Keep answer concise."
            user_msg = f"Question: {body.query}\n\nContext:\n{prompt_context}"
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": user_msg},
                ],
                "temperature": 0.0,
                "max_tokens": 512,
            }
            headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
            resp = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=30)
            if resp.status_code == 200:
                j = resp.json()
                llm_response_text = j["choices"][0]["message"]["content"].strip()
                usage = j.get("usage", {})
                llm_tokens = int(usage.get("total_tokens", 0) or 0)
            else:
                llm_response_text = None
        except Exception:
            llm_response_text = None

    # record usage (simple counters)
    tenant_usage = usage_stats.setdefault(tenant_id, {"queries": 0, "tokens": 0})
    tenant_usage["queries"] += 1
    tenant_usage["tokens"] += llm_tokens
    # persist usage
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute('INSERT OR REPLACE INTO usage_stats(tenant_id, queries, tokens) VALUES (?, ?, ?)', (tenant_id, tenant_usage['queries'], tenant_usage['tokens']))
        conn.commit()
        conn.close()
    except Exception:
        pass

    result_answer = llm_response_text if llm_response_text else retrieval_answer
    result = {
        "answer": result_answer,
        "retrieval_answer": retrieval_answer,
        "citations": citations,
        "confidence": confidence,
        "llm_tokens": llm_tokens,
    }
    return result

# Helper to rebuild vectors for MVP (simple, recompute all docs)

def rebuild_vectors(tenant_id: Optional[str] = None):
    global vectorizer, doc_matrix
    texts = [d["text"] for d in documents]
    if not texts:
        vectorizer = None
        doc_matrix = None
        return
    vectorizer = TfidfVectorizer().fit(texts)
    doc_matrix = vectorizer.transform(texts)

@app.get("/status")
def status():
    return {"tenants": len(tenants), "users": len(users), "documents": len(documents)}


@app.get("/admin/tenants")
def admin_tenants(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    tid = user.get("tenant_id")
    t = tenants.get(tid)
    return {"tenant_id": tid, "tenant": t}


@app.get("/admin/documents")
def admin_documents(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    tid = user.get("tenant_id")
    docs = [d for d in documents if d.get("tenant_id") == tid]
    return {"tenant_id": tid, "documents": docs}


@app.get("/admin/usage_csv")
def admin_usage_csv(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    tid = user.get("tenant_id")
    rows = [["tenant_id", "queries", "tokens"]]
    usage = usage_stats.get(tid)
    if usage:
        rows.append([tid, usage.get("queries", 0), usage.get("tokens", 0)])
    else:
        rows.append([tid, 0, 0])
    output = io.StringIO()
    writer = csv.writer(output)
    for r in rows:
        writer.writerow(r)
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers={"Content-Disposition": f"attachment; filename=usage_{tid}.csv"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
