import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'
import IngestPage from './pages/IngestPage'
import DocsPage from './pages/DocsPage'
import UsagePage from './pages/UsagePage'
import AuthPage from './pages/AuthPage'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('admin_token'))
  const [apiKey, setApiKey] = useState(localStorage.getItem('api_key'))

  useEffect(()=>{
    if(token) localStorage.setItem('admin_token', token)
    else localStorage.removeItem('admin_token')
  }, [token])
  useEffect(()=>{
    if(apiKey) localStorage.setItem('api_key', apiKey)
    else localStorage.removeItem('api_key')
  }, [apiKey])
  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/ingest" element={<Ingest />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
  )
}
