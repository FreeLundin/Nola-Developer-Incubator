import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const dataDir = path.resolve(process.cwd(), 'data');
const leaderboardFile = path.join(dataDir, 'leaderboard.json');

function readLeaderboard() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    if (!fs.existsSync(leaderboardFile)) fs.writeFileSync(leaderboardFile, JSON.stringify({ scores: [] }, null, 2));
    const content = fs.readFileSync(leaderboardFile, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('read leaderboard error', err);
    return { scores: [] };
  }
}

function writeLeaderboard(data: any) {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    fs.writeFileSync(leaderboardFile, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('write leaderboard error', err);
    return false;
  }
}

// Get top N scores
router.get('/api/leaderboard', (req, res) => {
  const top = Math.min(50, parseInt(String(req.query.top || '10'), 10));
  const data = readLeaderboard();
  const scores = (data.scores || []).slice(0, top);
  res.json({ ok: true, scores });
});

// Submit a score: { name, score }
router.post('/api/leaderboard/submit', (req, res) => {
  const { name, score } = req.body || {};
  if (!name || typeof score !== 'number') return res.status(400).json({ ok: false, error: 'invalid' });
  const data = readLeaderboard();
  data.scores = data.scores || [];
  data.scores.push({ name, score, ts: Date.now() });
  // sort desc
  data.scores.sort((a: any, b: any) => b.score - a.score);
  // keep top 100
  data.scores = data.scores.slice(0, 100);
  const ok = writeLeaderboard(data);
  if (!ok) return res.status(500).json({ ok: false, error: 'failed' });
  res.json({ ok: true });
});

export default router;

