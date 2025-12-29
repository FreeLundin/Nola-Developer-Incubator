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

---

## 🌐 Deployment

### Vercel (Recommended)

This application is **production-ready for Vercel deployment**:

✅ **Public Access** - Deployed instances are publicly accessible to anyone with the URL  
✅ **One-Click Deploy** - Use the "Deploy with Vercel" button above  
✅ **Auto-Deploy** - Push to main branch automatically deploys  
✅ **Preview URLs** - Every PR gets its own preview deployment  

**Complete deployment instructions:** See [README_VERCEL.md](README_VERCEL.md)

**Key Features When Deployed:**
- Game accessible at `https://your-project-name.vercel.app`
- Share the link with anyone - no login or setup required for players
- Automatic HTTPS and global CDN
- API routes work as serverless functions
- Database persists user data and high scores

#### Understanding Vercel Runtimes

This project uses **Node.js runtime** for serverless functions (not Edge runtime), which is important for the following reasons:

**Why Node.js Runtime?**
- Uses Node-specific APIs (fs, path, Buffer, crypto)
- Requires process.env for environment variables
- Compatible with Express.js middleware
- Supports PostgreSQL database connections

The runtime is explicitly set in `api/index.js`:
```javascript
export const runtime = 'nodejs';
```

**Edge vs Node.js Runtime:**
- **Edge Runtime**: Lightweight, ultra-fast, runs on Vercel's edge network, limited Node.js API support
- **Node.js Runtime**: Full Node.js API support, slightly slower cold starts, required for database and filesystem operations

#### Environment Variables for Vercel

When deploying to Vercel, configure these environment variables in your project settings:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string (from Neon or other provider)
- `NODE_ENV` - Set to `production`

**How to Set Environment Variables:**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with appropriate values
4. **Important**: Choose the correct environment:
   - **Production**: For main branch deployments
   - **Preview**: For PR and branch previews
   - **Development**: For local development (use `.env` file instead)

#### Viewing Function Logs in Vercel

To debug issues in production:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on **Deployments**
4. Select a specific deployment
5. Click on the **Functions** tab
6. View real-time logs for each serverless function invocation

**Logs include:**
- Request method and path
- Timestamp
- Error messages and stack traces
- Response status codes

**Reference:** [Vercel Function Logs Documentation](https://vercel.com/docs/observability/runtime-logs)

For FUNCTION_INVOCATION_FAILED errors, check:
- Environment variables are set correctly
- No missing dependencies
- No unhandled promise rejections
- Runtime is set to 'nodejs' for Node-dependent code

**Additional Resources:**
- [Vercel Errors Reference](https://vercel.com/docs/errors/FUNCTION_INVOCATION_FAILED)
- [Node.js Runtime Documentation](https://vercel.com/docs/functions/runtimes/node-js)

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
- **Project Lead** - Brandon Lundin

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
