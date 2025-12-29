#!/usr/bin/env node
// Seed Supabase demo data. Usage:
// SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node server/supabase/seed.js

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const fs = require('fs');
const path = require('path');

async function seedLocal() {
  // Ensure data directories
  const dataDir = path.resolve(process.cwd(), 'data');
  const leaderboardFile = path.join(dataDir, 'leaderboard.json');
  const sessionsDir = path.join(dataDir, 'sessions');
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir);

    const leaderboard = {
      scores: [
        { name: 'King Rex', score: 120, ts: Math.floor(Date.now() / 1000) },
        { name: 'Queen Zulu', score: 95, ts: Math.floor(Date.now() / 1000) },
        { name: 'Lil Jester', score: 80, ts: Math.floor(Date.now() / 1000) },
      ],
    };
    fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboard, null, 2), 'utf8');
    console.log('Wrote demo leaderboard to', leaderboardFile);

    const sessionId = `local-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const sessionFile = path.join(sessionsDir, `${sessionId}.json`);
    const session = { id: sessionId, savedAt: new Date().toISOString(), payload: { player: 'guest', state: { score: 5 } } };
    fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2), 'utf8');
    console.log('Wrote demo session to', sessionFile);

    console.log('Local seeding complete.');
    return 0;
  } catch (err) {
    console.error('Local seeding failed:', err);
    return 1;
  }
}

async function run() {
  if (!url || !key) {
    console.warn('SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY are not set. Falling back to local file-based seed.');
    const code = await seedLocal();
    process.exit(code);
  }

  try {
    // dynamic import so script doesn't fail if lib isn't installed
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(url, key, { auth: { persistSession: false } });

    console.log('Inserting demo leaderboard entries...');
    const leaderboard = [
      { name: 'King Rex', score: 120, ts: Math.floor(Date.now() / 1000) },
      { name: 'Queen Zulu', score: 95, ts: Math.floor(Date.now() / 1000) },
      { name: 'Lil Jester', score: 80, ts: Math.floor(Date.now() / 1000) },
    ];

    const { data: lbData, error: lbError } = await supabase.from('leaderboard').insert(leaderboard);
    if (lbError) {
      console.error('Failed to insert leaderboard rows:', lbError);
    } else {
      console.log('Leaderboard demo rows inserted:', lbData?.length || 0);
    }

    console.log('Inserting demo session...');
    const session = { payload: { player: 'guest', state: { score: 5 } } };
    const { data: sData, error: sError } = await supabase.from('sessions').insert([session]);
    if (sError) {
      console.error('Failed to insert session:', sError);
    } else {
      console.log('Session inserted, id:', sData && sData[0] && (sData[0].id || sData[0]));
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
