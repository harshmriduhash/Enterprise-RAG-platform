import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Ingest from './pages/Ingest'
import Documents from './pages/Documents'
import Usage from './pages/Usage'
import Auth from './pages/Auth'

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
        <Nav token={token} setToken={setToken} apiKey={apiKey} setApiKey={setApiKey} />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/pricing" element={<Pricing/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/ingest" element={<Ingest />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
