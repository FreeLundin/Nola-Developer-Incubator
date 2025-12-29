# Supabase Setup (Optional)

This project supports optional Supabase integration for session storage and leaderboards.
If you provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) the server will use Supabase; otherwise it falls back to local file storage under `data/`.

1) Create a Supabase project at https://supabase.com.
2) In the SQL editor, run the schema found at `server/supabase/schema.sql` or use the supabase CLI:

   supabase db remote set <your-db-connection-string>
   psql < server/supabase/schema.sql

3) Set environment variables in your deployment or development environment:

   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

4) Restart the server. The endpoints are:

   POST /api/session/save      - Save a session (returns id)
   GET  /api/session/:id       - Load session by id
   GET  /api/leaderboard       - Get top scores (query param `top`)
   POST /api/leaderboard/submit - Submit a score { name, score }

Security note: Keep the service role key secret (use repo secrets in CI or deployment).

