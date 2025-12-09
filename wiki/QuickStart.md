# Quick Start

This page provides a short set of steps to get the game running locally and to access the design documents and developer workflows.

Prerequisites
- Node.js (LTS)
- npm
- Git

Run the game (development)

```powershell
npm install
npm run dev
# Open http://localhost:5000 in your browser
```

Run type check

```powershell
npm run check
```

Open docs site

```powershell
npm run open:site
# or
python -m http.server 8081 -d docs/website
# Open http://localhost:8081
```

Access the GDD

- Game Design Document: `docs/GAME_DESIGN.md` (also linked from the repo README and this wiki)

QR code

- Generate a QR for quick mobile testing:

```powershell
npm run qr
```

Contributors
- See `docs/CONTRIBUTING.md` for commit message rules and the pre-commit checklist.

