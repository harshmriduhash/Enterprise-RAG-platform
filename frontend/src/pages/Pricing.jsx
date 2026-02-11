import React from 'react'
import { motion } from 'framer-motion'

export default function Pricing(){
  return (
    <div className="page">
      <motion.section className="hero" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
        <h2 style={{margin:0}}>Pricing</h2>
        <p className="muted">Pilot pricing for early customers. Simple, usage-based pricing for the MVP.</p>
      </motion.section>

      <div className="cards">
        <div className="card">
          <h3>Starter</h3>
          <p className="muted">Free trial • 1000 queries/month</p>
        </div>
        <div className="card">
          <h3>Pilot</h3>
          <p className="muted">$599/month • Shared SLA • Email support</p>
        </div>
        <div className="card">
          <h3>Enterprise</h3>
          <p className="muted">Custom pricing • Dedicated infrastructure • SSO</p>
        </div>
      </div>
    </div>
  )
}
