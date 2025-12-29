import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const dataDir = path.resolve(process.cwd(), 'data');
const sessionsDir = path.join(dataDir, 'sessions');

function ensureDirs() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir);
}

// Simple session save/load stubs for MVP
router.post('/api/session/save', async (req, res) => {
  try {
    ensureDirs();
    const payload = req.body || {};
    const id = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 9);
    const file = path.join(sessionsDir, `${id}.json`);
    fs.writeFileSync(file, JSON.stringify({ id, savedAt: new Date().toISOString(), payload }, null, 2), 'utf-8');
    res.json({ ok: true, id });
  } catch (err) {
    console.error('session save error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

router.get('/api/session/:id', async (req, res) => {
  try {
    ensureDirs();
    const id = req.params.id;
    const file = path.join(sessionsDir, `${id}.json`);
    if (!fs.existsSync(file)) return res.status(404).json({ ok: false, error: 'not found' });
    const content = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(content);
    res.json({ ok: true, data });
  } catch (err) {
    console.error('session load error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

export default router;
