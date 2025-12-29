import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const dataDir = path.resolve(process.cwd(), 'data');
const leaderboardFile = path.join(dataDir, 'leaderboard.json');

let useSupabase = false;
let supabaseClient: any = null;
try {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient } = require('@supabase/supabase-js');
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    useSupabase = true;
    console.log('LeaderboardRoutes: Using Supabase for leaderboard');
  }
} catch (err) {
  console.log('LeaderboardRoutes: Supabase not configured or failed to load, falling back to file storage');
}

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
router.get('/api/leaderboard', async (req, res) => {
  const top = Math.min(50, parseInt(String(req.query.top || '10'), 10));
  if (useSupabase && supabaseClient) {
    const { data, error } = await supabaseClient.from('leaderboard').select('*').order('score', { ascending: false }).limit(top);
    if (error) return res.status(500).json({ ok: false, error: String(error) });
    return res.json({ ok: true, scores: data });
  }

  const data = readLeaderboard();
  const scores = (data.scores || []).slice(0, top);
  res.json({ ok: true, scores });
});

// Submit a score: { name, score }
router.post('/api/leaderboard/submit', async (req, res) => {
  const { name, score } = req.body || {};
  if (!name || typeof score !== 'number') return res.status(400).json({ ok: false, error: 'invalid' });

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient.from('leaderboard').insert([{ name, score, ts: Date.now() }]);
    if (error) return res.status(500).json({ ok: false, error: String(error) });
    return res.json({ ok: true });
  }

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
