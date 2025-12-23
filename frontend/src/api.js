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
