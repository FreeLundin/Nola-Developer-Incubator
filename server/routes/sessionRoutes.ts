import express from 'express';
import path from 'path';
import fs from 'fs';
// Try to use Supabase if available in env
let useSupabase = false;
let supabaseClient: any = null;
try {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    // dynamic import to avoid forcing dependency when not used
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createClient } = require('@supabase/supabase-js');
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    useSupabase = true;
    console.log('SessionRoutes: Using Supabase for sessions');
  }
} catch (err) {
  console.log('SessionRoutes: Supabase not configured or failed to load, falling back to file storage');
}

const router = express.Router();
const dataDir = path.resolve(process.cwd(), 'data');
const sessionsDir = path.join(dataDir, 'sessions');

function ensureDirs() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir);
}

router.post('/api/session/save', async (req, res) => {
  try {
    if (useSupabase && supabaseClient) {
      const payload = req.body || {};
      const { data, error } = await supabaseClient.from('sessions').insert([{ payload }]);
      if (error) {
        console.error('supabase insert error', error);
        return res.status(500).json({ ok: false, error: String(error) });
      }
      return res.json({ ok: true, id: data[0].id });
    }
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
    if (useSupabase && supabaseClient) {
      const id = req.params.id;
      const { data, error } = await supabaseClient.from('sessions').select('*').eq('id', id).single();
      if (error) {
        return res.status(404).json({ ok: false, error: String(error) });
      }
      return res.json({ ok: true, data });
    }
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
