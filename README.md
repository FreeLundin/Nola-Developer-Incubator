# 🎭 NDI_MardiGrasParade

+> Playtest (public): Try the live build: https://mardi-gras-parade-game.vercel.app/ (legacy; may be removed)
+> Developer (local): Run the dev server and open http://localhost:5000
+
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **An immersive 3D Mardi Gras parade experience playable directly in your browser!**
> 
> Catch beads, doubloons, and cups from parade floats while competing with AI opponents in this celebration of New Orleans culture.

---

## 🌐 Live Demo

**Note:** This repository has been migrated away from Vercel to GitHub Pages for frontend deploys. The old Vercel configuration has been archived to `vercel.json.bak` and `vercel.json` is marked deprecated to avoid accidental Vercel deploys.

If you still have a working public Vercel URL, you can use it for playtesting, but new deploys should use GitHub Pages (instructions below).

### Deploy to GitHub Pages (recommended)

This repo includes a GitHub Actions workflow that builds the site and publishes `dist/public` to GitHub Pages (`gh-pages` branch). The workflow is located at `.github/workflows/deploy-gh-pages.yml`.

To deploy manually via Actions:
1. Push to `main` (the workflow will build and publish automatically), or use the `workflow_dispatch` trigger in the Actions UI to run it on demand.
2. Ensure `npm run build` completes successfully and `dist/public/index.html` is created.

The site will be available at `https://<your-org-or-username>.github.io/<repository-name>/` when published.

### Legacy: Vercel (archived)

If you rely on the previous Vercel deployment, note that the Vercel config is intentionally deprecated in this repository. Original `vercel.json` content has been moved to `vercel.json.bak` for reference.

---

## 🚀 Quick Start (Local Development)

Get the simulator running in under 2 minutes (developer):

```bash
# Clone repository
git clone https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame.git
cd MardiGrasParadeGame

# Install dependencies
npm ci

# Start development server (dev):
npm run dev

# Open locally → http://localhost:5000
```

### Windows PowerShell notes

If you get errors like "`npm.ps1 cannot be loaded because running scripts is disabled on this system`", run this in PowerShell (temporary for the session):

```powershell
# Allow scripts for this session (safe, temporary):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# If npm.ps1 wrapper still blocks, run via cmd fallback:
cmd /c "npm ci"
```

If `npx` or `npm exec` is blocked by the PS wrapper, use the `cmd /c` fallback shown above.

---

## 🔗 Public Playtest

- Developers: run the local dev server with `npm run dev` and open `http://localhost:5000`.
- For a public instance, deploy using the GitHub Actions workflow to GitHub Pages. See the section above for details.

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

---

## 🌐 Deployment

### GitHub Pages (Recommended)

This application is **production-ready for GitHub Pages deployment**:

✅ **Public Access** - Deployed instances are publicly accessible to anyone with the URL  
✅ **Auto-Deploy** - Push to main branch automatically deploys  
✅ **Preview URLs** - Every PR gets its own preview deployment  

**Complete deployment instructions:** See [README_VERCEL.md](README_VERCEL.md)

**Key Features When Deployed:**
- Game accessible at `https://your-project-name.vercel.app`
- Share the link with anyone - no login or setup required for players
- Automatic HTTPS and global CDN
- API routes work as serverless functions
- Database persists user data and high scores

### Testing Your Deployment

Once deployed, anyone can test by visiting:
```
https://your-project-name.vercel.app
```

No authentication needed - the game loads and plays immediately in the browser!

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

---

## 📚 Documentation

### Getting Started
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - How to contribute to the project
- **[DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)** - Detailed technical setup and development workflow

### Community & Contact
- **Project Lead** - Brian C Lundin
- **Discord (community)** - Nola Unreal Developer Incubator: https://discord.com/channels/809846008842158161/1424089949224960031

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

## 🚨 Troubleshooting & Public Playtest

If the public playtest URL returns an error (503 or similar):

- Confirm the server is running locally: `npm run dev` (serves on http://localhost:5000)
- Check the health endpoint: `curl http://localhost:5000/health` should return `{ status: 'ok' }`.
- For a publicly accessible instance, deploy to Vercel (recommended) or another hosting provider.


---

## 🛡️ Server & Deployment Updates (2025-12-18)

- Graceful shutdown implemented: server now tracks open sockets and destroys lingering connections on shutdown. This improves reliability when restarting under process managers (pm2) or tunnels (cloudflared).
- Use `startServer()` export from `server/index.ts` for programmatic start/shutdown in tests/CI.
