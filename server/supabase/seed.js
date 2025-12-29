#!/usr/bin/env node
// Seed Supabase demo data. Usage:
// SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node server/supabase/seed.js

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

async function run() {
  if (!url || !key) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set.');
    console.error('This script supports only Supabase seeding. To apply SQL directly: psql -f server/supabase/seed.sql');
    process.exit(1);
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

