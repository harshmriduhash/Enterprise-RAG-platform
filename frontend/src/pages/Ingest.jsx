import React, {useState, useEffect} from 'react'
import api, { ingestFile } from '../api'

export default function Ingest(){
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    if(!file) return setStatus('Select a file')
    setStatus('Uploading...')
    try{
      const res = await ingestFile(file)
      if(res && res.status === 'ingested'){
        setStatus(`Uploaded — chunks: ${res.chunks}`)
        // refresh documents list
        loadDocs()
      }else{
        setStatus('Uploaded')
      }
    }catch(err){
      setStatus('Error')
    }
  }

  const [docs, setDocs] = useState([])

  async function loadDocs(){
    try{
      const res = await api.get('/admin/documents')
      const list = Array.isArray(res) ? res : (res.documents || res.data || [])
      setDocs(list)
    }catch(e){
      setDocs([])
    }
  }

  useEffect(()=>{ loadDocs() },[])

  return (
    <div className="page">
      <h2>Ingest</h2>
      <form onSubmit={handleSubmit} className="card form">
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
        <p>{status}</p>
      </form>
      <section className="notes">
        <h4>Accepted types</h4>
        <p>PDF, TXT, MD. Chunks are stored per-tenant.</p>
      </section>
      <section className="notes">
        <h4>Recent uploads</h4>
        {docs.length===0 && <p className="muted">No uploads yet</p>}
        {docs.map(d=> (
          <div key={d.doc_id || d.filename} style={{padding:8, borderRadius:6, background:'#071226', margin:'6px 0'}}>
            <strong>{d.doc_id || d.filename}</strong>
            <div className="muted">Chunks: {d.chunks || (d.text ? 1 : 0)}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
