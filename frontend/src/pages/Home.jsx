import React from 'react'
import { motion } from 'framer-motion'

export default function Home(){
  return (
    <div className="page">
      <motion.section className="hero" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
        <h1 style={{margin:'0 0 8px 0'}}>Enterprise RAG — Fast MVP</h1>
        <p className="muted">A lightweight retrieval-augmented generation admin and ingest demo. Use the nav to try impressive features.</p>
      </motion.section>

      <motion.div className="cards" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
        <div className="card">
          <h3>Ingest!</h3>
          <p className="muted">Upload Markdown documents and build a local index for quick demos.</p>
        </div>
        <div className="card">
          <h3>Query!</h3>
          <p className="muted">Run queries against ingested content and evaluate retrieval quality.</p>
        </div>
        <div className="card">
          <h3>API Keys!</h3>
          <p className="muted">Create API keys for tenant-level access and measure usage.</p>
        </div>
      </motion.div>
    </div>
  )
}
