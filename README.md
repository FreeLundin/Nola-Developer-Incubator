# 🎭 NDI_MardiGrasParade — Playable 3D Mardi Gras Parade

This repository contains a browser-playable 3D Mardi Gras parade experience built with React, React Three Fiber, Three.js and TypeScript.

Public playtest (GitHub Pages): https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/

Quick references
- Canonical documentation and planning artifacts: `docs/README.md` (Game Design, Product Backlog, Roadmap, Ticket Template).
- Playwright tests: `tests/playwright/` (skeletons and test cases).
- PR preview workflow: `.github/workflows/pr-preview.yml` uploads preview artifacts and can publish previews to `gh-pages` when the `GH_PAGES_PAT` or `GH_PAGES_DEPLOY_TOKEN` secret is configured.

Quick start (developer)
1. Clone the repo and enter the directory:

   git clone https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame.git
   cd MardiGrasParadeGame

2. Install dependencies and run dev server:

   npm ci
   npm run dev

3. Open in browser:
   - Public preview: https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/
   - Local dev server: http://localhost:5000

Documentation
- Full documentation and planning artifacts live under `docs/`. Start here: `docs/README.md`.

Contributing
- Run `npm ci` and `npm run dev` to test locally.
- Create a feature branch, open a PR, and link to the related doc/backlog item.
- PR previews upload an artifact and (if enabled) publish a live preview to GitHub Pages. See `.github/workflows/pr-preview.yml` for details.

If you'd like, I can:
- Expand backlog items into individual GitHub issues and attach Playwright test skeletons.
- Clean up UI/HUD code and implement the minimal HUD/joystick improvements described in the backlog.
- Enable and validate gh-pages publishing for PR previews (requires `GH_PAGES_PAT` secret).

## 🚀 Quick Start (Local Development)

Get the simulator running in under 2 minutes:

```bash
# Clone repository
git clone https://github.com/FreeLundin/Nola-Developer-Incubator.git
cd Nola-Developer-Incubator

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser → http://localhost:5000
```

That's it! The simulator will open in your default browser.

---

## 🎮 Game Features

### Core Gameplay
- **🕹️ Player Movement** - WASD, click-to-move, and touch controls for mobile
- **🎪 Parade Floats** - Moving floats throw collectibles with realistic physics
- **🎯 Collectibles** - Beads, doubloons, cups, king cake, and power-ups
- **⚡ Combo System** - Chain catches within 3 seconds for bonus points
- **🎨 Color Matching** - Catch your assigned color for 3x points
- **💪 Power-Ups** - Speed boost (1.5x) and double points (2x)
- **📈 Level Progression** - Complete objectives to advance through levels

### Competition & Challenge
- **🤖 AI Competitors** - 6 AI opponents with unique personalities (King Rex, Queen Zulu, etc.)
- **⚠️ Obstacles** - Moving hazards that break combos
- **👹 Aggressive NPCs** - Chase the player when hit
- **🎯 Strategic Gameplay** - Trajectory hints and smart timing

### Customization & Settings
- **🎨 Character Skins** - Unlock cosmetic appearances with coins (golden, rainbow, ghost, king, jester)
- **🔊 Audio Controls** - Adjustable music and sound effects volumes
- **📱 Mobile Optimized** - Responsive touch controls with optional on-screen joystick
- **👀 Camera Modes** - Toggle between third-person and first-person views
- **⚙️ Difficulty Scaling** - Accessible for ages 10-80, gradually scales after level 3

---

## 🏗️ Project Structure

```
NDI_MardiGrasParade/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── game/      # Game components and logic
│   │   ├── lib/stores/    # Zustand state management
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets (textures, sounds)
│
├── server/                # Express.js backend
│   ├── index.ts          # Main server entry
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # Database operations
│
├── shared/               # Shared types and schemas
│   └── schema.ts        # Drizzle ORM database schema
│
└── docs/                # Documentation
    ├── CONTRIBUTING.md  # Contribution guidelines
    └── DEVELOPMENT_GUIDE.md  # Technical setup
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Three.js** - WebGL 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Zustand** - Lightweight state management
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework

### Backend
- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type-safe server code
- **Drizzle ORM** - Lightweight SQL ORM
- **PostgreSQL** - Robust relational database (Neon)
- **WebSocket** - Real-time communication (optional)

### Backend Features
- REST API endpoints for game data and user profiles (see `server/routes.ts`).
- Leaderboard persistence and retrieval (see `data/leaderboard.json` and server storage implementations).
- Session management and simple authentication for player profiles and playtests.
- Score submission and validation endpoints for recording high scores.
- Admin endpoints for managing mock sessions, test data, and scheduled events.
- Optional WebSocket support for real-time score updates and multiplayer sync hooks.

(See the `server/` directory for implementation details and `shared/schema.ts` for DB schemas.)

---

## 🌐 Deployment

This repository no longer uses Vercel. Recommended deployment options:

- GitHub Pages (frontend only): The client build can be published to `gh-pages`. The project includes helper scripts (`scripts/publish-gh-pages.*`) and a `build` workflow that can be adapted for GitHub Pages.
- Self-hosted Node.js: Run the Express backend and serve the built client from a Node process. Use `npm run build` and `npm start` to run the production server.
- Docker / Cloud provider: Build a Docker image and deploy to your cloud provider of choice (e.g., AWS, GCP, Azure, Render). Configure environment variables such as `DATABASE_URL` and `SESSION_SECRET` in your hosting environment.

If you need help with a specific hosting provider, I can add provider-specific instructions and CI/CD examples.

---

## 💻 Development

### Available Scripts

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Push database schema
npm run db:push
```

### Development Workflow

1. **Start the dev server** - `npm run dev`
2. **Make changes** - Files auto-reload via HMR
3. **Test in browser** - View at http://localhost:5000
4. **Check types** - Run `npm run check` before committing
5. **Build** - Run `npm run build` to test production build

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=5000
NODE_ENV=development
```

## QA Checklist

This section gives a short, actionable QA checklist for distributed testers and a clear status of what is included in the published production build.

- Production (public playtest): https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/
  - Current status (2025-12-30): The public URL exists but some users report a blank canvas; see "Blank Page Troubleshooting" below.

What's included in the production build (Testable features - DONE)
- Player movement: WASD, Arrow keys, and click-to-move (desktop) — shipped and testable.
- Touch joystick and basic touch tap movement (mobile) — basic functionality present; some edge cases remain.
- Parade floats spawn and travel along the route — visible in the built client.
- Collectibles: beads, doubloons, cups, king cake, and power-ups — spawn and can be picked up.
- Scoring, combos and color-match bonus — score updates when collectibles are caught.
- Power-ups (speed boost, double points) and basic level progression — applied at runtime.
- Leaderboard submission (basic) — frontend posts to server and local `data/leaderboard.json` is updated when running the local server.
- Audio files and textures — included in `client/public/sounds/` and `client/public/textures/` (however see troubleshooting below if audio/textures fail to load in production).

High priority items still NOT in production (UNDONE / In Progress)
- PB-001: Joystick polish & multi-touch handling — In Progress (additional fixes required for flawless multi-touch behavior).
- PB-002: Minimal HUD / compact UI mode — To Do (not merged to production build).
- PB-003: Audio toggle persistence across reloads/platforms — To Do (session-level toggle works, persistence does not yet survive reloads consistently).
- PB-005: Visual remaining floats indicator — To Do (not yet implemented in the production build).
- Backend: Cloud save / robust session tracking, full leaderboard security and moderation — Backlog.

Have all sprint goals been accomplished?
- Short answer: No. Core gameplay features listed as "DONE" are included in the frontend build, but several sprint UX polish items and persistence/back-end hardening remain outstanding (see the list above).

QA quick tests for distributed team (step-by-step)
1. Prefer testing the local production build when the public URL shows a blank screen:

```powershell
# From repo root
npm ci
npm run build
npm run ci:serve
# Open: http://127.0.0.1:5000
```

2. Manual smoke checklist (10–15 minutes):
- Verify the page loads with an active WebGL canvas (black/mardi-gras backdrop should be visible).
- Confirm no fatal red errors in DevTools Console (F12) and check the Network tab for missing assets (404s).
- Move the player with WASD and Arrow keys; confirm movement is responsive.
- Click on the ground to move the player; on mobile, confirm touch joystick responds.
- Observe floats and collectibles spawning; catch one collectible and confirm the score increments.
- Activate a power-up and confirm its effect (speed or double points).
- Submit a score and check that the server accepts it (and local `data/leaderboard.json` updates when using the local server).
- Toggle audio on/off and verify background music and SFX behave (mute/unmute).
- Try the game in Chrome, Firefox, and Safari (mobile if possible).

3. Automated test hints (if you want to run them locally):
- Playwright (Chromium): `npx playwright test tests/playwright/joystick.spec.ts --project=chromium`
- Run all Playwright tests: `npx playwright test`

Blank Page Troubleshooting (Production GitHub Pages)
- Symptoms: Page loads but the canvas is blank or the app never initializes; DevTools show 404s for JS/CSS/assets or an incorrect base path.
- Common root causes:
  1. Incorrect base href or Vite BASE_URL used at build time. If the `index.html` base path contains trailing whitespace or a wrong path the app's assets will 404 and the runtime bundle will not execute.
  2. The `gh-pages` branch does not contain a correct `dist/public` build (publish step may have been skipped or gated by `GH_PAGES_CONFIRM`).
  3. Runtime asset path expectations (VITE_ASSET_BASE_URL or BASE_URL) differ from the path GitHub Pages serves the project under.

Quick checks you can do from a maintainer machine:
- Inspect the published branch's `index.html` to verify the base href:

```powershell
# Fetch / inspect the published branch (replace origin/gh-pages with your remote branch if different)
git fetch origin gh-pages; git show origin/gh-pages:dist/public/index.html > /tmp/gh-index.html; notepad /tmp/gh-index.html
```

- Look for incorrect `base` tag values or stray whitespace.
- In the browser, open DevTools → Network and reload the page; filter for 404 responses to find missing assets.

How to republish the frontend (maintainer/power-user steps)
- Build and publish to gh-pages (PowerShell example; requires push rights and `gh-pages` tooling):

```powershell
# Build and prepare GH_PAGES_BASE automatically
node ./scripts/build-gh-pages.js
# Confirm and publish
$env:GH_PAGES_CONFIRM = '1'; npm run publish:gh-pages
# Alternative single-line (PowerShell):
$env:GH_PAGES_CONFIRM='1'; npm run deploy:gh-pages
```

- After publishing, allow ~60 seconds for GitHub Pages to serve the new content and re-test the public URL.

If the public link still shows a blank page after re-publish, gather these artifacts and file a ticket:
- Browser console screenshot showing 404s or runtime exceptions
- The `index.html` found in the `gh-pages` branch (to confirm base href)
- Exact steps used to publish (commands, environment variables)

How to report problems found during QA
- Create an issue or attach findings to your PR with: reproduction steps, expected vs actual, browser/OS/device, console/network screenshots, and a reference to the related backlog item (if known).

Notes & next steps
- I can inspect the live `gh-pages` branch and open a PR that fixes the `base`/asset path if that is what is causing the blank page. I can also re-run a local build and produce a short diagnostic (console/network screenshots) showing the 404s causing the blank page.
- If you'd like, I can also add a small Playwright smoke test that loads the built `dist/public` and verifies the canvas initializes (fast guard for CI on PRs).

---

## 📚 Documentation

### Getting Started
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - How to contribute to the project
- **[DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)** - Detailed technical setup and development workflow

### Code Resources
- **Backend API** - Express.js REST API (see `server/routes.ts`)
- **Database Schema** - Drizzle ORM schema (see `shared/schema.ts`)
- **Game Components** - React Three.js components (see `client/src/components/game/`)
- **State Management** - Zustand stores (see `client/src/lib/stores/`)

---

## 🎯 Game Mechanics

### Scoring System
- **Base Points** - 1 point per collectible
- **Color Match Bonus** - 3x points for matching your assigned color
- **Combo Multiplier** - Catch multiple items within 3 seconds
- **Coin Rewards** - Earn coins from catches and combos

### Level Progression
- **Starting Level** - Level 1 with tutorial
- **Floats Per Level** - 10 floats must pass to complete each level
- **Difficulty Curve** - Gentle progression through level 3, then gradual scaling
- **Target Scores** - Starts at 5 points, increases by 2 each level

### Power-Ups
- **Speed Boost** - 1.5x movement speed for 8 seconds
- **Double Points** - 2x score for 8 seconds
- **King Cake** - Rare collectible worth 5 points

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Whether you're fixing bugs, adding features, improving documentation, or creating new assets, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly** - Ensure the game still runs correctly
5. **Commit your changes** - Use clear, descriptive commit messages
6. **Push to your fork** - `git push origin feature/your-feature-name`
7. **Open a Pull Request** - Describe your changes and why they're valuable

### Code Style

- **TypeScript** - Use strict mode, type everything
- **React** - Functional components with hooks
- **Formatting** - Follow existing code style
- **Comments** - Add comments for complex logic
- **Testing** - Test your changes thoroughly in the browser

For detailed contribution guidelines, see [CONTRIBUTING.md](docs/CONTRIBUTING.md).

---

## 🎨 For Designers & Artists

### What You Can Contribute

Even without coding experience, you can contribute:

- **3D Models** - Create or improve parade floats, collectibles, or environment assets
- **Textures** - Design materials and texture maps
- **Sound Effects** - Create or source audio for catches, combos, power-ups
- **Music** - Compose festive background music
- **UI/UX Design** - Propose interface improvements
- **Documentation** - Improve guides and tutorials

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for specific guidelines.

---

## 📈 Performance Targets

### Desktop
- **Frame Rate** - 60 FPS @ 1080p on mid-range hardware
- **Load Time** - Under 5 seconds initial load
- **Responsiveness** - Smooth controls and physics

### Mobile
- **Frame Rate** - 45+ FPS on iPhone 11 / Galaxy S10 equivalent
- **Touch Controls** - Responsive joystick and tap-to-move
- **Battery Life** - Optimized for extended play sessions

---

## 📝 License

This project is distributed under a traditional proprietary license. See the `LICENSE` file for details.

---

## 🙏 Acknowledgments

### Technology
- **React Three Fiber** by Poimandres - Amazing React renderer for Three.js
- **Three.js** by Mr.doob - Powerful 3D graphics library
- **TailwindCSS** by Tailwind Labs - Excellent utility-first CSS
- **Drizzle ORM** by Drizzle Team - Lightweight TypeScript ORM

### Inspiration
- **Mardi Gras** - Celebrating the rich culture and traditions of New Orleans
- **Parade Culture** - The joy and community spirit of festival celebrations

---

## 🌟 Community & Support

### Getting Help
- **📖 Documentation** - Check [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) first
- **🐛 Issues** - [Create an issue](https://github.com/FreeLundin/Nola-Developer-Incubator/issues) for bugs or feature requests
- **💬 Discussions** - [GitHub Discussions](https://github.com/FreeLundin/Nola-Developer-Incubator/discussions) for questions and ideas

### Stay Connected
- **GitHub** - [FreeLundin/Nola-Developer-Incubator](https://github.com/FreeLundin/Nola-Developer-Incubator)
- **Project Lead** - Brian C Lundin

---

## 🎉 Let's Celebrate Mardi Gras!

NDI_MardiGrasParade brings the excitement of Mardi Gras parades to players everywhere. Whether you're familiar with the tradition or experiencing it for the first time, we hope you enjoy catching beads and celebrating!

**Laissez les bons temps rouler!** (Let the good times roll!)

---

<div align="center">

**⭐ Star this repo if you like the project! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/FreeLundin/Nola-Developer-Incubator?style=social)](https://github.com/FreeLundin/Nola-Developer-Incubator/stargazers)

**Made with ❤️ in the spirit of Mardi Gras**

</div>
