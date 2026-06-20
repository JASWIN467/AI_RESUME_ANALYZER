// server.js — Local development Express server
// Mirrors how Vercel routes /api/analyze.js in production
// Run with: node server.js  (or npm run server)

import express from 'express'
import { readFileSync } from 'fs'
import { createRequire } from 'module'
import { config } from 'dotenv'

config({ path: '.env.local' })

const app = express()
app.use(express.json({ limit: '2mb' }))

// Dynamically import the serverless handler
const { default: analyzeHandler } = await import('./api/analyze.js')

app.post('/api/analyze', analyzeHandler)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅  Dev API server running at http://localhost:${PORT}`)
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✓ set' : '✗ MISSING — set it in .env.local'}`)
})
