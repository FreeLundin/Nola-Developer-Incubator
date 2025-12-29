import express from 'express';

const router = express.Router();

// Simple session save/load stubs for MVP
router.post('/api/session/save', async (req, res) => {
  try {
    // TODO: persist to DB (Supabase/SQLite) - stubbed for now
    const payload = req.body;
    // echo back with an id
    res.json({ ok: true, id: Date.now(), payload });
  } catch (err) {
    console.error('session save error', err);
    res.status(500).json({ ok: false });
  }
});

router.get('/api/session/:id', async (req, res) => {
  try {
    // TODO: fetch from DB - stubbed response
    const id = req.params.id;
    res.json({ ok: true, id, data: null });
  } catch (err) {
    console.error('session load error', err);
    res.status(500).json({ ok: false });
  }
});

export default router;

