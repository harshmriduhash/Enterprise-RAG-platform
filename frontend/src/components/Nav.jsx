import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Nav({ token, setToken, apiKey, setApiKey }){
  const navigate = useNavigate()
  function handleLogout(){
    setToken(null)
    setApiKey(null)
    navigate('/auth')
  }
  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Enterprise RAG</Link>
        <nav className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/ingest">Ingest</Link>
          <Link to="/docs">Documents</Link>
          <Link to="/usage">Usage</Link>
        </nav>
      </div>
      <div className="nav-right">
        {token ? (
          <>
            <span className="api-key">{apiKey ? apiKey.slice(0,10) + '…' : 'No API Key'}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/auth" className="btn">Sign in</Link>
        )}
      </div>
    </header>
  )
}
