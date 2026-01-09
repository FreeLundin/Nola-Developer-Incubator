const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const DATA_DIR = path.resolve(__dirname)
const CONTROLS_FILE = path.join(DATA_DIR, 'controls.json')

// Ensure controls file exists
if(!fs.existsSync(CONTROLS_FILE)){
  fs.writeFileSync(CONTROLS_FILE, JSON.stringify({ joystickEnabled:true, flipControls:false, joystickSensitivity:1.0, handedness:'left' }, null, 2))
}

app.get('/mcp/controls', (req,res) => {
  try{
    const data = fs.readFileSync(CONTROLS_FILE,'utf8')
    res.json(JSON.parse(data))
  }catch(e){ res.status(500).json({error:'read_failed'}) }
})

app.post('/mcp/controls', (req,res) => {
  try{
    fs.writeFileSync(CONTROLS_FILE, JSON.stringify(req.body, null, 2))
    res.json({ ok: true })
  }catch(e){ res.status(500).json({ error: 'write_failed' }) }
})

// Accept blueprint mapping requests from IDE and return a blueprint-like json
app.post('/mcp/unreal/blueprint', (req,res) => {
  const { name, mapping } = req.body || {}
  if(!name || !mapping) return res.status(400).json({ error: 'missing' })

  // naive mapping generator
  const blueprint = { name, nodes: [] }
  for(const key of Object.keys(mapping)){
    blueprint.nodes.push({ node: 'SetVar', varName: key, value: mapping[key] })
  }

  res.json({ blueprint })
})

// Simple session save endpoint (file-based for MVP)
app.post('/mcp/session/save', (req,res) => {
  try{
    const data = req.body || {}
    const outPath = path.join(DATA_DIR, 'session.json')
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2))
    res.json({ ok: true })
  }catch(e){ res.status(500).json({ error: 'write_failed' }) }
})

// Leaderboard endpoints - store in data/leaderboard.json
app.get('/mcp/leaderboard', (req,res) => {
  try{
    const data = fs.readFileSync(path.join(DATA_DIR, 'data', 'leaderboard.json'),'utf8')
    res.json(JSON.parse(data))
  }catch(e){ res.status(500).json({ error: 'read_failed' }) }
})

app.post('/mcp/leaderboard/submit', (req,res) => {
  try{
    const entry = req.body || {}
    const p = path.join(DATA_DIR, 'data', 'leaderboard.json')
    const list = JSON.parse(fs.readFileSync(p,'utf8'))
    list.push({ ...entry, ts: Date.now() })
    // keep top 100 (no sorting for MVP)
    fs.writeFileSync(p, JSON.stringify(list.slice(-100), null, 2))
    res.json({ ok: true })
  }catch(e){ res.status(500).json({ error: 'write_failed' }) }
})

const PORT = process.env.PORT || 4004
app.listen(PORT, ()=> console.log('MCP server listening on', PORT))
