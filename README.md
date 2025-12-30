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

Quick summary and test checklist for maintainers, designers, and QA engineers.

- Production (public playtest): https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/ (frontend build published to GitHub Pages)

What's done (evidence in repo)
- Player movement (WASD, click-to-move, touch/joystick): implemented; see `client/src/components/` and test hook in `tests/playwright/joystick.spec.ts`.
- Parade floats and collectibles (beads, doubloons, cups, king cake, power-ups): implemented and described in `README.md` features.
- Scoring, combos and color-match bonus: implemented in game logic (see scoring references in README and stores).
- Power-ups (speed, double points) and basic level progression: implemented.
- Leaderboard & persistence: basic server endpoints and `data/leaderboard.json` exist for storing scores.
- Mobile optimizations: touch controls and optional on-screen joystick are present; Playwright skeleton test added for joystick.

Sprint status (from `docs/PRODUCT_BACKLOG.md`)
- Sprint A planned items (Joystick, HUD, Audio toggle, Floats indicator): NOT fully completed.
  - PB-001 Mobile & Desktop Joystick Improvements — In Progress
  - PB-002 Minimal HUD / Compact UI Mode — To Do
  - PB-003 Audio toggle persistence bugfix — To Do
  - PB-005 Visual remaining floats indicator — To Do

Conclusion: Sprint goals are not all accomplished yet. PB-001 is in progress; the other planned sprint items remain To Do.

What's undone / high priority
- Finalize joystick improvements and multi-touch handling (PB-001)
- Implement minimal HUD/compact UI mode (PB-002)
- Fix audio toggle persistence across reloads/platforms (PB-003)
- Add visual remaining floats indicator in HUD (PB-005)
- Backend session tracking / cloud save and Shop/monetization items live in backlog (PB-004, PB-007, PB-008)

Testable features & quick checks
- Manual smoke tests (local dev):
  1. Run the dev server: `npm run dev` and open http://localhost:5000. Confirm no console errors.
  2. Verify player movement: WASD, click-to-move, and touch/joystick on mobile/emulation move the player.
  3. Verify collectibles spawn, can be caught, and that score updates and collectible disappears.
  4. Verify combo behavior and color-match scoring.
  5. Verify power-up behavior (speed/double points) and temporary effect timing.
  6. Submit a score and confirm persistence in `data/leaderboard.json` or via `/api/leaderboard`.
  7. Toggle audio and camera mode settings and confirm effects.

- Automated (Playwright):
  - Joystick skeleton test is present at `tests/playwright/joystick.spec.ts` (smoke test). Run it locally with:

```bash
# Run joystick tests (Chromium)
npx playwright test tests/playwright/joystick.spec.ts --project=chromium
```

  - Run all Playwright tests:

```bash
npx playwright test
```

How to report problems found during QA
- Open an issue or attach to your PR with: reproduction steps, expected vs actual, browser/OS/device, screenshots or short video/GIF, and a reference to the related backlog item (if applicable).

Notes & next steps
- If you'd like, I can: create an `ASSET_SUBMISSION_TEMPLATE.md`, convert backlog rows into GitHub issues, or expand Playwright tests to cover power-ups, scoring edge cases, and leaderboard flows.

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
