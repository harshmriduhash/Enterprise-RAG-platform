import React, {useState} from 'react'
import {signup, signin, createKey, ingestFile, listDocs, downloadUsage} from './api'

export default function App(){
  const [email, setEmail] = useState('admin@acme.com')
  const [password, setPassword] = useState('Pass1234')
  const [token, setToken] = useState(null)
  const [apiKey, setApiKey] = useState(null)
  const [docs, setDocs] = useState([])
  const [file, setFile] = useState(null)

  async function handleSignup(){
    const res = await signup({org_name: 'Acme', admin_email: email, password})
    setToken(res.admin_token)
    alert('Signed up. Admin token saved.')
  }

  async function handleSignin(){
    const res = await signin({email, password})
    setToken(res.token)
    alert('Signed in. Token saved.')
  }

  async function handleCreateKey(){
    if(!token) return alert('Sign in first')
    const res = await createKey(token, {name: 'service-key-1'})
    setApiKey(res.api_key)
    alert('API key created')
  }

  async function handleIngest(e){
    e.preventDefault()
    if(!apiKey) return alert('Create API key first')
    if(!file) return alert('Select file')
    await ingestFile(apiKey, file)
    alert('Ingested')
  }

  async function handleListDocs(){
    if(!token) return alert('Sign in first')
    const res = await listDocs(token)
    setDocs(res.documents || [])
  }

  async function handleDownloadUsage(){
    if(!token) return alert('Sign in first')
    const blob = await downloadUsage(token)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'usage.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="container">
      <h1>Enterprise RAG — Admin (MVP)</h1>
      <section>
        <h2>Auth</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <div>
          <button onClick={handleSignup}>Signup</button>
          <button onClick={handleSignin}>Signin</button>
        </div>
        <div>Admin token: <code>{token}</code></div>
      </section>

      <section>
        <h2>API Key</h2>
        <button onClick={handleCreateKey}>Create API Key</button>
        <div>API Key: <code>{apiKey}</code></div>
      </section>

      <section>
        <h2>Ingest</h2>
        <form onSubmit={handleIngest}>
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
          <button type="submit">Upload</button>
        </form>
      </section>

      <section>
        <h2>Documents</h2>
        <button onClick={handleListDocs}>List Documents</button>
        <ul>
          {docs.map(d=> (<li key={d.chunk_id}><strong>{d.doc_id}</strong> — {d.chunk_id} — {d.text.slice(0,120)}</li>))}
        </ul>
      </section>

      <section>
        <h2>Usage</h2>
        <button onClick={handleDownloadUsage}>Download usage CSV</button>
      </section>

    </div>
  )
}
