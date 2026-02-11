import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Nav({ token, setToken, apiKey, setApiKey }){
  const navigate = useNavigate()
  function handleLogout(){
    if(setToken) setToken(null)
    if(setApiKey) setApiKey(null)
    navigate('/auth')
  }
  return (
    <header className="nav">
      <div className="nav-left">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Link to="/" className="brand">Enterprise RAG</Link>
        </motion.div>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/ingest">Ingest</NavLink>
          <NavLink to="/documents">Documents</NavLink>
          <NavLink to="/usage">Usage</NavLink>
        </nav>
      </div>
      <div className="nav-right">
        {token ? (
          <>
            <span className="api-key">{apiKey ? apiKey.slice(0,10) + '…' : 'No API Key'}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout!</button>
          </>
        ) : (
          <Link to="/auth" className="btn">Sign in</Link>
        )}
      </div>
    </header>
  )
}
