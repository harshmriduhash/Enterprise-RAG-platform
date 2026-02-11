import React from 'react'
import { motion } from 'framer-motion'

export default function Footer(){
  return (
    <motion.footer className="footer" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{color:'var(--muted)'}}>© {new Date().getFullYear()} Enterprise RAG</div>
        <div style={{color:'var(--muted)'}}>Built for demo <a href="/pricing" style={{color:'var(--accent)',textDecoration:'none'}}>Pricing</a></div>
      </div>
    </motion.footer>
  )
}
