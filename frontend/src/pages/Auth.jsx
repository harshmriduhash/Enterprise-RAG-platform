import React, {useState} from 'react'
import api from '../api'

export default function Auth(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function signup(e){
    e.preventDefault()
    try{
      const res = await api.post('/signup', {email, password})
      setMsg('Signed up — check console for API key')
    }catch(err){
      setMsg('Error')
    }
  }

  async function signin(e){
    e.preventDefault()
    try{
      const res = await api.post('/signin', {email, password})
      const token = res.data.token
      localStorage.setItem('token', token)
      setMsg('Signed in')
    }catch(err){
      setMsg('Signin failed')
    }
  }

  return (
    <div className="page auth">
      <h2>Auth</h2>
      <form onSubmit={signup} className="card form">
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="row">
          <button onClick={signup}>Sign Up</button>
          <button onClick={signin}>Sign In</button>
        </div>
        <p>{msg}</p>
      </form>
    </div>
  )
}
