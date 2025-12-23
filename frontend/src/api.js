const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

function authHeaders(extra = {}){
  const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
  const headers = {...extra}
  if(token) headers['Authorization'] = `Bearer ${token}`
const api = {
  get: async (path)=>{
    const res = await fetch(`${BASE}${path}`, {headers: authHeaders()})
    return res.json()
  },
  post: async (path, body)=>{
    const res = await fetch(`${BASE}${path}`, {method:'POST', headers: authHeaders({'Content-Type':'application/json'}), body: JSON.stringify(body)})
    return res.json()
  },
  postForm: async (path, formData)=>{
    const res = await fetch(`${BASE}${path}`, {method:'POST', headers: authHeaders(), body: formData})
    return res.json()
  download: async (path)=>{
    const res = await fetch(`${BASE}${path}`, {headers: authHeaders()})
    if(!res.ok) throw new Error('download failed')
    return res.blob()
  }
}
export default api

export async function signup(body){ return api.post('/signup', body) }
export async function signin(body){ return api.post('/signin', body) }
export async function createKey(body){ return api.post('/keys', body) }
export async function ingestFile(file){ const fd=new FormData(); fd.append('file', file); return api.postForm('/ingest', fd) }
export async function listDocs(){ return api.get('/admin/documents') }
export async function downloadUsage(){ return api.download('/admin/usage_csv') }
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export async function signup(body){
  const r = await fetch(`${BASE}/signup`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
  return r.json()
}

export async function signin(body){
  const r = await fetch(`${BASE}/signin`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
  return r.json()
}

export async function createKey(token, body){
  const r = await fetch(`${BASE}/keys`, {method:'POST', headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(body)})
  return r.json()
}

export async function ingestFile(apiKey, file){
  const fd = new FormData()
  fd.append('file', file)
  const r = await fetch(`${BASE}/ingest`, {method:'POST', headers:{'Authorization': `ApiKey ${apiKey}`}, body: fd})
  return r.json()
}

export async function listDocs(token){
  const r = await fetch(`${BASE}/admin/documents`, {method:'GET', headers:{'Authorization': `Bearer ${token}`}})
  return r.json()
}

export async function downloadUsage(token){
  const r = await fetch(`${BASE}/admin/usage_csv`, {method:'GET', headers:{'Authorization': `Bearer ${token}`}})
  const blob = await r.blob()
  return blob
}
