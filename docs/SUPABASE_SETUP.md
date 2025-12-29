# Supabase Setup (Optional)

This project supports optional Supabase integration for session storage and leaderboards.
If you provide `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_KEY`) the server will use Supabase; otherwise it falls back to local file storage under `data/`.

This doc shows the minimal steps to configure Supabase for this project, run the schema, and wire CI.

## 1) Create a Supabase project

1. Sign up / sign in at https://supabase.com and create a new project.
2. From your project dashboard, go to "Settings → API" to find your `SUPABASE_URL` and service role key (`SUPABASE_SERVICE_ROLE_KEY`). Keep the service role key private — store it as a secret in your CI/CD provider (e.g., GitHub Secrets).

## 2) Apply the schema

A ready-to-use SQL schema is included at `server/supabase/schema.sql`. It contains simple tables for `sessions` and `leaderboard`.

Options to apply the schema:

- Use the Supabase SQL editor (quick):
  - Open your Supabase project → SQL Editor → New query, paste the contents of `server/supabase/schema.sql` and run.

- Use the `supabase` CLI (recommended for reproducible setups):
  1. Install CLI: https://supabase.com/docs/guides/cli
     - macOS/Linux: `npm install -g supabase`
     - Windows (PowerShell): `npm install -g supabase`
  2. Authenticate and set the remote DB (example):

     # Bash
     supabase login
     supabase db remote set <your-db-connection-string>
     psql < server/supabase/schema.sql

     # PowerShell
     supabase login
     supabase db remote set <your-db-connection-string>
     psql -f server/supabase/schema.sql

  Note: `psql` must be available on your PATH for the above to work. If you prefer, copy/paste SQL into Supabase SQL editor.

## 3) Environment variables

Set the following environment variables in your development environment or in your deployment/CI settings:

- `SUPABASE_URL` — your Supabase project URL (e.g. `https://xxxxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (keep secret)

Examples:

# PowerShell (local dev)
$env:SUPABASE_URL = 'https://xxxxx.supabase.co'
$env:SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key'

# Bash (local dev / CI)
export SUPABASE_URL='https://xxxxx.supabase.co'
export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'

### GitHub Actions / CI

Add repository secrets (Settings → Secrets → Actions):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The provided CI workflow `.github/workflows/playwright-ci.yml` will use these secrets if available. If not set, the server will fall back to local file storage under `data/`.

## 4) Server endpoints (available after server restart)

- `POST /api/session/save`      - Save a session (returns `{ ok: true, id }`)
- `GET  /api/session/:id`       - Load session by id (returns `{ ok: true, data }`)
- `GET  /api/leaderboard`       - Get top scores (query param `top`)
- `POST /api/leaderboard/submit` - Submit a score `{ name, score }`

## 5) Quick smoke tests

Use curl (Linux/macOS) or PowerShell to verify the server is wired to Supabase (or fallback storage):

# Curl example (Bash)
curl -X POST "http://localhost:5000/api/session/save" -H "Content-Type: application/json" -d '{"player":"dev","state":{"score":10}}'

# PowerShell example
Invoke-RestMethod -Uri http://localhost:5000/api/session/save -Method POST -ContentType 'application/json' -Body '{"player":"dev","state":{"score":10}}'

If using Supabase and the insert succeeds, you should get back `{ "ok": true, "id": "..." }`.

## 6) Playwright CI notes

- The repository includes a CI workflow `.github/workflows/playwright-ci.yml` that installs Playwright browsers (`npx playwright install --with-deps`) and runs the Playwright tests.
- To allow Playwright tests to exercise Supabase-backed endpoints during CI, make sure to set the `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` GitHub Secrets.
- If you do not set Supabase secrets, CI will still run: the server will use local file storage under `data/` in the runner.

## 7) Security and housekeeping

- Do not commit service role keys to source control. Use repository secrets.
- For production, prefer using row-level security (RLS) and restricted policies; the service role key is powerful and should be reserved for trusted backend operations.

---

If you want, I can also:
- Provide a migration script (supabase cli or psql) that runs automatically in CI/deploy steps.
- Seed the leaderboard with demo entries for testing Playwright flows.
- Add a small Admin API to list sessions and leaderboard entries (protected by an env token).
