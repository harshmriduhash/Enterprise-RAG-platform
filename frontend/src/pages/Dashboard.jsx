import React, {useEffect, useState} from 'react'
import api from '../api'

export default function Dashboard(){
  const [docsCount, setDocsCount] = useState(null)
  const [queriesThisMonth, setQueriesThisMonth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    async function load(){
      setLoading(true)
      try{
        const docs = await api.get('/admin/documents')
        // docs may be array or object
        const docsNum = Array.isArray(docs) ? docs.length : (docs.count || docs.total || 0)
        // fetch usage CSV and parse
        let queries = 0
        try{
          const blob = await api.download('/admin/usage_csv')
          const txt = await blob.text()
          const lines = txt.trim().split(/\r?\n/)
          if(lines.length>=2){
            const cols = lines[1].split(',')
            queries = parseInt(cols[1]||'0') || 0
          }
        }catch(e){
          queries = 0
        }
        if(mounted){
          setDocsCount(docsNum)
          setQueriesThisMonth(queries)
        }
      }catch(e){
        if(mounted){ setDocsCount(0); setQueriesThisMonth(0) }
      }finally{ if(mounted) setLoading(false) }
    }
    load()
    return ()=>{ mounted=false }
  },[])

  // Query demo state
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [qLoading, setQLoading] = useState(false)

  async function runDemo(){
    if(!question) return
    setQLoading(true)
    setAnswer(null)
    try{
      // tenant_id will be provided via token payload on server; use stored tenant if available
      const tokenPayload = null
      // POST to /query — requires tenant_id; prompt user must be signed-in as admin
      // Best-effort: attempt to read tenant id from /admin/tenants
      let tenant_id = null
      try{ const t = await api.get('/admin/tenants'); tenant_id = t.tenant_id }catch(e){}
      const body = { tenant_id: tenant_id || '', query: question, top_k: 3 }
      const res = await api.post('/query', body)
      setAnswer(res.answer || res.retrieval_answer || 'No answer')
    }catch(e){
      setAnswer('Failed to query')
    }finally{ setQLoading(false) }
  }

  return (
    <div className="page">
      <h2>Dashboard</h2>
      <div className="cards">
        <div className="card">
          <h3>Usage</h3>
          <p>Queries this month: <strong>{loading? '…' : queriesThisMonth ?? '—'}</strong></p>
        </div>
        <div className="card">
          <h3>Documents</h3>
          <p>Indexed chunks / docs: <strong>{loading? '…' : docsCount ?? '—'}</strong></p>
        </div>
        <div className="card">
          <h3>Status</h3>
          <p>System status: <strong>OK</strong></p>
        </div>
      </div>
      <section className="hero">
        <h3>Showcase</h3>
        <p>Use the Ingest page to upload a knowledge base and then query via API.</p>
        <div style={{marginTop:12}}>
          <input placeholder="Ask a question about your docs" value={question} onChange={e=>setQuestion(e.target.value)} style={{width:'60%', padding:8, borderRadius:8, border:'1px solid rgba(255,255,255,0.04)'}} />
          <button onClick={runDemo} style={{marginLeft:8}}>{qLoading? 'Thinking…' : 'Run Query'}</button>
          {answer && <div style={{marginTop:12, padding:12, borderRadius:8, background:'rgba(255,255,255,0.02)'}}><strong>Answer</strong><p>{answer}</p></div>}
        </div>
      </section>
    </div>
  )
}
