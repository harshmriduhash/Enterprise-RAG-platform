import React, {useEffect, useState} from 'react'
import api from '../api'

export default function Documents(){
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load(){
    setLoading(true)
    setError(null)
    try{
      const res = await api.get('/admin/documents')
      const list = Array.isArray(res) ? res : (res.documents || res.data || [])
      setDocs(list)
    }catch(e){
      setError(e.message || 'Failed to load')
      setDocs([])
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="page">
      <h2>Documents</h2>
      <div style={{marginBottom:12}}>
        <button onClick={load}>Refresh</button>
      </div>
      <div className="list">
        {loading && <p>Loading…</p>}
        {!loading && error && <p className="muted">Error: {error}</p>}
        {!loading && docs.length===0 && !error && <p>No documents yet.</p>}
        {docs.map(d=> (
          <div className="doc" key={d.id || d.filename || Math.random()}>
            <h4>{d.title || d.filename || 'Untitled'}</h4>
            <p>Chunks: {d.chunks || d.chunk_count || 0} • Tenant: {d.tenant_id || d.tenant}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
