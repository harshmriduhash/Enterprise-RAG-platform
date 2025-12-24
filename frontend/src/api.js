const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

function authHeaders(extra = {}) {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
  const headers = { ...extra }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

const api = {
  get: async (path) => {
    const res = await fetch(`${BASE}${path}`, { headers: authHeaders() })
    return res.json()
  },
  post: async (path, body) => {
    const res = await fetch(`${BASE}${path}`, { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) })
    return res.json()
  },
  postForm: async (path, formData) => {
    const res = await fetch(`${BASE}${path}`, { method: 'POST', headers: authHeaders(), body: formData })
    return res.json()
  },
  download: async (path) => {
    const res = await fetch(`${BASE}${path}`, { headers: authHeaders() })
    if (!res.ok) throw new Error('download failed')
    return res.blob()
  }
}

export default api

export async function signup(body) { return api.post('/signup', body) }
export async function signin(body) { return api.post('/signin', body) }
export async function createKey(body) { return api.post('/keys', body) }
export async function ingestFile(file) { const fd = new FormData(); fd.append('file', file); return api.postForm('/ingest', fd) }
export async function listDocs() { return api.get('/admin/documents') }
export async function downloadUsage() { return api.download('/admin/usage_csv') }
