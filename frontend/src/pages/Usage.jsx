import React, {useEffect, useState} from 'react'
import api from '../api'

export default function Usage(){
  const [usage, setUsage] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load(){
    setLoading(true)
    setError(null)
    try{
      const blob = await api.download('/admin/usage_csv')
      const txt = await blob.text()
      const lines = txt.trim().split(/\r?\n/)
      const list = []
      if(lines.length>=2){
        const cols = lines[1].split(',')
        list.push({tenant_id: cols[0], queries: parseInt(cols[1]||'0')||0, tokens: parseInt(cols[2]||'0')||0})
      }
      setUsage(list)
    }catch(e){
      setError(e.message || 'Failed to load')
      setUsage([])
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() },[])

  async function downloadCsv(){
    try{
      const blob = await api.download('/admin/usage_csv')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'usage.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }catch(e){
      alert('Download failed')
    }
  }

  return (
    <div className="page">
      <h2>Usage</h2>
      <div style={{marginBottom:12}}>
        <button onClick={load}>Refresh</button>
        <button onClick={downloadCsv} style={{marginLeft:8}}>Download CSV</button>
      </div>
      {loading && <p>Loading…</p>}
      {!loading && error && <p className="muted">Error: {error}</p>}
      {!loading && !error && (
        <table className="table">
          <thead>
            <tr><th>Tenant</th><th>Queries</th><th>Tokens</th></tr>
          </thead>
          <tbody>
            {usage.map(u=> (
              <tr key={u.tenant_id || u.tenant}>
                <td>{u.tenant_id || u.tenant}</td>
                <td>{u.queries || 0}</td>
                <td>{u.tokens || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
