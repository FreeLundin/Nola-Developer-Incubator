# Mardi Gras Parade Game - Dual Platform Project

## ?? Overview

This repository contains **two versions** of the Mardi Gras Parade game:

1. **Web Version** (React Three.js) - Browser-based, casual gameplay
2. **Unreal Engine Version** - Native desktop and mobile, enhanced graphics

Both versions share the same backend API and game design, allowing players to experience the game on any platform.

---

## ?? Project Structure

```
Mardi-Gras-Parade-Game/
??? client/   # React Three.js frontend (WEB VERSION)
?   ??? src/
?   ?   ??? components/game/  # Game components
??   ??? lib/stores/       # Zustand state management
?   ?   ??? hooks/          # React hooks
?   ??? public/    # Static assets
?   ??? index.html
?
??? server/            # Express backend (SHARED)
?   ??? index.ts       # Main server file
?   ??? routes.ts         # API routes
?   ??? storage.ts            # Database operations
?   ??? vite.ts # Vite integration
?
??? shared/ # Database schema (SHARED)
?   ??? schema.ts    # Drizzle ORM schema
?
??? unreal/              # Unreal Engine project (UNREAL VERSION)
?   ??? MardiGrasParade/
?       ??? Source/ # C++ source code
?       ??? Content/          # Assets, Blueprints, UI
?       ??? Config/           # Project configuration
?       ??? MardiGrasParade.uproject
?
??? docs/        # Documentation
?   ??? UNREAL_CONVERSION_PLAN.md       # Detailed conversion roadmap
?   ??? RUNNING_BOTH_VERSIONS.md        # Side-by-side guide
?   ??? UNREAL_BLUEPRINT_GUIDE.md       # Non-technical customization
?   ??? QUICK_START_UNREAL.md           # Setup instructions
?
??? package.json         # Web version dependencies
??? tsconfig.json      # TypeScript configuration
??? vite.config.ts # Vite configuration
??? drizzle.config.ts         # Database configuration
??? README.md                 # This file
```

---

## ?? Quick Start

### Web Version (Existing)

```bash
# Install dependencies
npm install

# Run development server (backend + frontend)
npm run dev

# Open browser
# Navigate to http://localhost:5000

# Build for production
npm run build

# Run production server
npm run start
```

### Unreal Version (New - Setup Required)

**Prerequisites:**
- Unreal Engine 5.4+
- Visual Studio 2022
- Git LFS

**Setup:**
```bash
# 1. Install prerequisites (see QUICK_START_UNREAL.md)

# 2. Ensure backend is running
npm run dev

# 3. Open Unreal project
cd unreal/MardiGrasParade
# Double-click MardiGrasParade.uproject

# 4. Press Play (Alt+P) in Unreal Editor
```

**Full Setup Guide:** See [`QUICK_START_UNREAL.md`](./QUICK_START_UNREAL.md)

---

## ?? Documentation Index

### For Everyone
- **[README.md](./README.md)** (this file) - Project overview
- **[RUNNING_BOTH_VERSIONS.md](./RUNNING_BOTH_VERSIONS.md)** - How to run web + Unreal simultaneously

### For Developers
- **[UNREAL_CONVERSION_PLAN.md](./UNREAL_CONVERSION_PLAN.md)** - Complete conversion roadmap
- **[QUICK_START_UNREAL.md](./QUICK_START_UNREAL.md)** - Unreal setup instructions
- **Web Version Code** - See `client/src/components/game/`

### For Designers (Non-Technical)
- **[UNREAL_BLUEPRINT_GUIDE.md](./UNREAL_BLUEPRINT_GUIDE.md)** - Customize game without coding
- **Blueprint Classes** - See `unreal/MardiGrasParade/Content/Blueprints/`

### For Project Managers
- **[UNREAL_CONVERSION_PLAN.md](./UNREAL_CONVERSION_PLAN.md)** - Timeline, phases, deliverables
- **Feature Conversion Matrix** - Track parity between versions

---

## ?? Game Features

### Core Gameplay
- ? **Player Movement** - WASD/click-to-move/touch controls
- ? **Parade Floats** - Moving floats throw collectibles
- ? **Collectibles** - Beads, doubloons, cups, king cake, power-ups
- ? **Combo System** - Chain catches within 3 seconds
- ? **Color Matching** - Catch your color for 3x points!
- ? **Power-Ups** - Speed boost (1.5x speed), double points (2x score)
- ? **Level Progression** - Complete floats to advance (10 floats per level)

### Competition
- ? **Competitor Bots** - 6 AI opponents (King Rex, Queen Zulu, etc.)
- ? **Aggressive NPCs** - Black/white squares chase player when hit
- ? **Obstacles** - Moving hazards break combo
- ? **Bot Leaderboard** - Track competitor catches

### Monetization
- ? **Coin System** - Earn coins from catches and combos
- ? **Cosmetic Skins** - Unlock golden, rainbow, ghost, king, jester skins
- ? **Ad Rewards** - Watch ads for bonuses (optional)

### Settings
- ? **Audio Controls** - Music and SFX volume
- ? **Touch Controls** - Toggle joystick on mobile
- ? **Camera Modes** - Third-person / first-person toggle
- ? **Difficulty Curve** - Casual (ages 10-80), scales after level 3

---

## ?? Tech Stack

### Web Version
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Three.js | 3D graphics |
| React Three Fiber | React wrapper for Three.js |
| React Three Drei | Useful Three.js helpers |
| Zustand | State management |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| TailwindCSS | Styling |

### Backend (Shared)
| Technology | Purpose |
|------------|---------|
| Express.js | HTTP server |
| TypeScript | Type safety |
| Drizzle ORM | Database ORM |
| PostgreSQL (Neon) | Database |
| WebSocket (ws) | Real-time features (optional) |

### Unreal Version
| Technology | Purpose |
|------------|---------|
| Unreal Engine 5.4 | Game engine |
| C++ | Core systems |
| Blueprints | Visual scripting & customization |
| UMG | UI system |
| Enhanced Input | Input system |
| Chaos Physics | Physics simulation |

---

## ?? Development Workflow

### Daily Workflow

**Morning:**
```bash
# 1. Pull latest changes
git pull origin main

# 2. Start backend
npm run dev

# 3. Test web version
# Open http://localhost:5000

# 4. Test Unreal version (if working on it)
# Open unreal/MardiGrasParade/MardiGrasParade.uproject
# Press Play (Alt+P)
```

**During Development:**
- Make changes to web or Unreal
- Both use same backend automatically
- Test frequently
- Commit small changes

**Before Committing:**
```bash
# 1. Test both versions work
# 2. Check no compilation errors
# 3. Verify API endpoints work

# 4. Stage changes
git add .

# 5. Commit with descriptive message
git commit -m "[web/unreal/shared] feat: description"

# Examples:
# [web] feat: added joystick sensitivity slider
# [unreal] feat: implemented parade float AI
# [shared] feat: added leaderboard API endpoint
# [both] fix: corrected combo calculation bug

# 6. Push to remote
git push origin main
```

### Branching Strategy

```
main (production-ready)
??? feature/web-[feature-name]      # Web version features
??? feature/unreal-[feature-name]   # Unreal version features
??? feature/shared-[feature-name]   # Backend/shared features
??? bugfix/[issue-description]      # Bug fixes
```

---

## ?? Testing

### Web Version Testing
```bash
# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:5000

# Test checklist:
# - Player movement (WASD, click-to-move)
# - Catching collectibles
# - Combo system
# - Power-ups
# - Level progression
# - UI/HUD
# - Settings menu
# - Touch controls (mobile emulation)
```

### Unreal Version Testing
```bash
# Ensure backend is running
npm run dev

# Open Unreal Editor
cd unreal/MardiGrasParade
start MardiGrasParade.uproject

# Test in Editor:
# Press Alt+P (Play in Editor)

# Test checklist:
# - Same as web version above
# - API integration with backend
# - Blueprint customization works
# - UI widgets display correctly
# - Audio plays correctly
```

### API Integration Testing
```bash
# Start backend with logging
npm run dev

# Monitor logs in terminal
# Should see API calls from both versions:
# [WEB] GET /api/leaderboard 200 in 45ms
# [UNREAL] POST /api/save 200 in 12ms
```

---

## ?? Building & Deployment

### Web Version

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
# Build client and server
npm run build

# Run production server
npm run start
```

**Deploy to:**
- Vercel (frontend)
- Railway/Render (backend)
- Or unified deployment (Replit, etc.)

### Unreal Version

**Development:**
- Play in Editor (Alt+P)

**Package for Testing:**
1. **File ? Package Project ? Windows (64-bit)**
2. Select output folder
3. Wait for packaging (5-15 minutes)
4. Run `.exe` from output folder

**Package for Mobile:**
- **iOS:** File ? Package Project ? iOS (requires Mac)
- **Android:** File ? Package Project ? Android (requires Android SDK)

**Deploy to:**
- **Steam** (PC) - Use Steamworks SDK
- **App Store** (iOS) - Requires Apple Developer account
- **Google Play** (Android) - Requires Google Play Developer account

---

## ?? Troubleshooting

### Web Version Issues

**Issue: Server won't start**
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed (replace PID)
taskkill /PID [PID] /F

# Restart server
npm run dev
```

**Issue: Database connection failed**
```bash
# Check DATABASE_URL in .env
# Push schema to database
npm run db:push
```

**Issue: Build fails**
```bash
# Clear cache and rebuild
rm -rf node_modules
rm -rf dist
npm install
npm run build
```

### Unreal Version Issues

**Issue: Project won't open**
```bash
# Regenerate project files
cd unreal/MardiGrasParade
# Right-click MardiGrasParade.uproject
# ? Generate Visual Studio project files

# Build in Visual Studio
# Open MardiGrasParade.sln
# Press F7 (Build Solution)

# Try opening .uproject again
```

**Issue: C++ code won't compile**
```bash
# Clean rebuild
# Delete: Binaries/, Intermediate/, Saved/
# Regenerate VS project files
# Build in Visual Studio
```

**Issue: Hot Reload not working**
- Close Unreal Editor completely
- Compile in Visual Studio
- Reopen Unreal Editor
- (Hot Reload only for minor changes)

---

## ?? Contributing

### Getting Started
1. Clone repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Style

**TypeScript/JavaScript:**
- Use TypeScript strict mode
- Prefer functional components (React)
- Use meaningful variable names
- Comment complex logic

**C++:**
- Follow Unreal Engine coding standards
- Use `UPROPERTY` for Blueprint-exposed variables
- Comment public functions
- Mark functions `const` when appropriate

**Blueprints:**
- Use descriptive names (BP_ParadeFloat_KingRex)
- Organize nodes with comments
- Collapse complex logic into functions
- Use Reroute nodes for clean connections

### Pull Request Process
1. Update documentation if needed
2. Test both versions if changes affect shared code
3. Write clear PR description
4. Link related issues
5. Request review from team member

---

## ?? License

MIT License - See LICENSE file for details

---

## ?? Team & Contact

### Core Team
- **Project Lead:** [Name]
- **Web Developer:** [Name]
- **Unreal Developer:** [Name]
- **Designer:** [Name]
- **Audio:** [Name]

### Contact
- **GitHub Issues:** [Repository Issues URL]
- **Discord:** [Discord Server Link]
- **Email:** [Team Email]

---

## ??? Roadmap

### Phase 1: Foundation (Weeks 1-2) ?
- [x] Web version complete
- [ ] Unreal project setup
- [ ] Core C++ classes
- [ ] Basic Blueprints

### Phase 2: Core Gameplay (Weeks 3-4) ??
- [ ] Player movement (Unreal)
- [ ] Parade floats (Unreal)
- [ ] Collectibles (Unreal)
- [ ] Game mode (Unreal)

### Phase 3: AI & Competition (Weeks 5-6) ?
- [ ] Competitor bots (Unreal)
- [ ] Aggressive NPCs (Unreal)
- [ ] AI behavior trees
- [ ] Bot customization

### Phase 4: UI & UX (Weeks 7-8) ?
- [ ] HUD widgets (UMG)
- [ ] Menu screens
- [ ] Settings system
- [ ] Touch controls

### Phase 5: Audio & Polish (Week 9) ?
- [ ] Audio system
- [ ] Sound cues
- [ ] Visual effects
- [ ] Optimization

### Phase 6: Monetization (Week 10) ?
- [ ] Skin system
- [ ] In-app purchases
- [ ] Ad integration
- [ ] Analytics

### Phase 7: Mobile Optimization (Week 11) ?
- [ ] Touch controls
- [ ] Performance optimization
- [ ] UI scaling
- [ ] Device testing

### Phase 8: Launch (Week 12) ?
- [ ] Final testing
- [ ] Bug fixes
- [ ] Platform builds
- [ ] Deployment

---

## ?? Success Metrics

### Technical Metrics
- **Web Version:** 60 FPS @ 1080p on mid-range devices
- **Unreal PC:** 60 FPS @ 1080p on GTX 1060 equivalent
- **Unreal Mobile:** 45 FPS on iPhone 11 / Galaxy S10
- **Crash-free rate:** >99%

### Game Metrics
- **Feature parity:** 100% between versions
- **Average session:** >5 minutes
- **Day 1 retention:** >40%
- **Day 7 retention:** >20%

---

## ?? Acknowledgments

- **Unreal Engine** by Epic Games
- **React Three Fiber** by Poimandres
- **Three.js** by Mr.doob
- **TailwindCSS** by Tailwind Labs
- **Drizzle ORM** by Drizzle Team
- **Mardi Gras** - New Orleans tradition

---

## ?? Additional Resources

### Learning
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Unreal Engine Documentation](https://docs.unrealengine.com)
- [Three.js Documentation](https://threejs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)

### Community
- [Unreal Forums](https://forums.unrealengine.com)
- [Unreal Slackers Discord](https://unrealslackers.org)
- [React Three Fiber Discord](https://discord.gg/poimandres)
- [r/unrealengine](https://reddit.com/r/unrealengine)

### Tools
- [Blender](https://www.blender.org) - 3D modeling
- [GIMP](https://www.gimp.org) - Image editing
- [Audacity](https://www.audacityteam.org) - Audio editing
- [Git LFS](https://git-lfs.github.com) - Large file storage

---

## ? Quick Links

- ?? **[Conversion Plan](./UNREAL_CONVERSION_PLAN.md)** - Detailed roadmap
- ?? **[Blueprint Guide](./UNREAL_BLUEPRINT_GUIDE.md)** - Non-technical customization
- ?? **[Quick Start](./QUICK_START_UNREAL.md)** - Setup instructions
- ?? **[Running Both](./RUNNING_BOTH_VERSIONS.md)** - Side-by-side guide

---

**Happy Developing! ??????**

*Let the good times roll!* - Laissez les bons temps rouler!
