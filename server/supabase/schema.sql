-- Supabase schema for MardiGrasParadeGame
-- Run in Supabase SQL editor or via supabase CLI: supabase db remote set && supabase db reset && psql < schema.sql

-- Sessions table: stores saved game sessions
create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  payload jsonb not null,
  created_at timestamptz default now()
);

-- Leaderboard table: store top scores
create table if not exists leaderboard (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  score integer not null,
  ts bigint not null,
  created_at timestamptz default now()
);

create index if not exists idx_leaderboard_score on leaderboard (score desc);

