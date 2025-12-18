# Quick Playtesting (shareable link)

Date: 2025-12-18

Goal: Provide an easy, reliable public URL for playtesting so people off your LAN can play immediately.

Recommended (fast, free): Cloudflare Tunnel (`cloudflared`)
- Stable HTTPS URL, low friction, works well for dev playtests.
- We use a small helper so the current public URL is recorded in `docs/last-public-url.txt` and `docs/launch.html` redirects to it.

Minimal workflow (developer)

1. Start the dev server locally (Vite + Express):

```powershell
npm install
npm run dev
```

2. Expose the server (Cloudflare Tunnel) — one-time install then run:

```powershell
# install cloudflared per Cloudflare docs (Windows: installer or scoop/choco)
# run tunnel (this will use the config in scripts/cloudflared-config.yml if present):
.
# foreground (shows logs):
.
.\scripts\cloudflared.exe --config scripts\cloudflared-config.yml tunnel run MardiGrasParadeSim2026 --loglevel debug

# or quick mapping (ephemeral) if you don't need named tunnel:
cloudflared tunnel --url http://localhost:5000
```

3. Confirm the public URL (helper writes it):

```powershell
Get-Content .\docs\last-public-url.txt
Start-Process .\docs\launch.html
```

One-click helper (PowerShell) — generate QR and write launch file

```powershell
# Run after you start your tunnel and have the public URL in LAST_URL (or update last-public-url.txt manually)
node scripts/update-public-url.mjs
# This writes docs/launch.html (redirect page) and docs/browser-qr.svg
```

Ephemeral fallback: localtunnel

```powershell
npx localtunnel --port 5000 --print-url
# Example returned URL: https://hot-lizard-90.loca.lt
```

Quick tips
- Use `docs/launch.html` as the canonical quick link for testers (it always redirects to the current public URL recorded in `docs/last-public-url.txt`).
- Don’t expose admin paths or secrets while the tunnel is active.
- For repeated public demos, consider deploying the client (static) to GitHub Pages or Vercel.

If you want, I can add a GitHub Action to automatically update `docs/last-public-url.txt` when you post a new URL (requires a PAT with repo permissions).
