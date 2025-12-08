# ?? Mardi Gras Parade Game - Dual Platform Project

[![Unreal Engine](https://img.shields.io/badge/Unreal%20Engine-5.7-blue)](https://www.unrealengine.com/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **A 3D Mardi Gras parade game where you catch beads, doubloons, and cups from parade floats!**
> 
> Available in **two versions**: Web (React Three.js) and Native (Unreal Engine 5.7)

<div align="center">
  <img src="docs/images/banner.png" alt="Mardi Gras Parade Game" width="800" />
</div>

---

## ?? Quick Start

### Choose Your Version

| Platform | Status | Quick Start |
|----------|--------|-------------|
| **?? Web Version** | ? Production Ready | `npm run dev` ? http://localhost:5000 |
| **?? Unreal Version** | ? Foundation Ready | See [START_HERE.md](START_HERE.md) |

### Fastest Way to Play (Web)

```bash
# Clone repository
git clone https://github.com/FreeLundin/Nola-Developer-Incubator.git
cd Nola-Developer-Incubator

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:5000
```

### Fastest Way to Build (Unreal)

```bash
# After cloning, see detailed setup:
1. Read START_HERE.md (your immediate guide)
2. Generate Visual Studio project files
3. Build in Visual Studio
4. Open in Unreal Editor
5. Start creating!
```

---

## ?? Documentation Hub

### ?? Getting Started

| Document | Purpose | Audience | Time |
|----------|---------|----------|------|
| **[START_HERE.md](START_HERE.md)** | ?? **Your first stop for Unreal!** | Everyone | 5 min |
| **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** | Navigation hub for all docs | Everyone | 5 min |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Quick reference card | Everyone | 2 min |

### ?? For Unreal Engine Development

| Document | Purpose | Time |
|----------|---------|------|
| **[UNREAL_CONVERSION_PLAN.md](UNREAL_CONVERSION_PLAN.md)** | Complete 12-week conversion roadmap | 45 min |
| **[QUICK_START_UNREAL.md](QUICK_START_UNREAL.md)** | Detailed setup instructions | 15 min |
| **[UNREAL_BLUEPRINT_GUIDE.md](UNREAL_BLUEPRINT_GUIDE.md)** | No-code customization guide | 40 min |
| **[UNREAL_SETUP_COMPLETE.md](UNREAL_SETUP_COMPLETE.md)** | Setup verification guide | 10 min |

### ?? For Web Development

| Document | Purpose | Time |
|----------|---------|------|
| **[README_DUAL_PLATFORM.md](README_DUAL_PLATFORM.md)** | Project overview & structure | 10 min |
| **[RUNNING_BOTH_VERSIONS.md](RUNNING_BOTH_VERSIONS.md)** | Run web + Unreal side-by-side | 30 min |

### ?? API Documentation

| Resource | Description |
|----------|-------------|
| **Backend API** | Express.js REST API (see `server/routes.ts`) |
| **Database Schema** | Drizzle ORM schema (see `shared/schema.ts`) |
| **C++ API** | Unreal C++ classes (see `unreal/MardiGrasParade/Source/`) |

---

## ??? Project Structure

```
Nola-Developer-Incubator/
?
??? ?? WEB VERSION (React Three.js)
?   ??? client/            # React frontend
?   ?   ??? src/
?   ?   ?   ??? components/game/   # Game components
?   ?   ?   ??? lib/stores/   # Zustand state management
?   ?   ?   ??? hooks/         # React hooks
?   ?   ??? public/        # Static assets
?   ?
?   ??? server/  # Express backend (SHARED)
?   ?   ??? index.ts          # Main server
?   ?   ??? routes.ts      # API routes
?   ?   ??? storage.ts             # Database operations
?   ?
? ??? shared/           # Database schema (SHARED)
?       ??? schema.ts              # Drizzle ORM schema
?
??? ?? UNREAL VERSION (Unreal Engine 5.7)
?   ??? unreal/
?       ??? MardiGrasParade/       # Unreal project
?       ?   ??? Source/     # C++ source code
?       ?   ?   ??? MardiGrasParade/
?    ?   ?       ??? Characters/ # Player, bots, NPCs
?       ?   ?   ??? GameModes/   # Game rules & logic
?       ?   ?       ??? Collectibles/    # Beads, doubloons, etc.
?       ?   ?  ??? AI/         # AI behavior
? ?   ??? Content/ # Assets & Blueprints
?       ?   ?   ??? Blueprints/         # Blueprint classes
?     ?   ?   ??? Materials/   # Materials & instances
?       ?   ?   ??? Meshes/ # 3D models
?       ?   ?   ??? Audio/   # Sounds & music
?       ?   ?   ??? UI/        # UMG widgets
?       ?   ?   ??? Maps/   # Levels
?       ?   ??? Config/            # Configuration files
?       ?
?       ??? MardiGrasParade_SourceTemplates/  # C++ templates
?       ??? Setup-UnrealProject.ps1     # Automation script
?
??? ?? DOCUMENTATION (You are here!)
    ??? START_HERE.md             # ?? Start here for Unreal!
    ??? DOCUMENTATION_INDEX.md       # Navigation hub
    ??? QUICK_REFERENCE.md               # Cheat sheet
    ??? UNREAL_CONVERSION_PLAN.md        # 12-week roadmap
    ??? UNREAL_BLUEPRINT_GUIDE.md        # No-code customization
    ??? QUICK_START_UNREAL.md            # Setup guide
    ??? RUNNING_BOTH_VERSIONS.md     # Side-by-side guide
    ??? UNREAL_SETUP_COMPLETE.md         # Setup verification
 ??? README_DUAL_PLATFORM.md        # Detailed overview
```

---

## ?? Game Features

### ?? Core Gameplay

| Feature | Description | Status |
|---------|-------------|--------|
| **Player Movement** | WASD, click-to-move, touch controls | ? Complete |
| **Parade Floats** | Moving floats throw collectibles | ? Complete (Web) / ?? In Progress (Unreal) |
| **Collectibles** | Beads, doubloons, cups, king cake, power-ups | ? Complete |
| **Combo System** | Chain catches within 3 seconds | ? Complete |
| **Color Matching** | Catch your color for 3x points! | ? Complete |
| **Power-Ups** | Speed boost, double points | ? Complete |
| **Level Progression** | Complete floats to advance | ? Complete |

### ?? Competition

| Feature | Description | Status |
|---------|-------------|--------|
| **Competitor Bots** | 6 AI opponents with unique personalities | ? Complete (Web) |
| **Aggressive NPCs** | Chase player when hit | ? Complete (Web) |
| **Obstacles** | Moving hazards break combo | ? Complete (Web) |
| **Bot Leaderboard** | Track competitor catches | ? Complete (Web) |

### ?? Monetization

| Feature | Description | Status |
|---------|-------------|--------|
| **Coin System** | Earn coins from gameplay | ? Complete |
| **Cosmetic Skins** | Unlock with coins | ? Complete |
| **Ad Rewards** | Optional ads for bonuses | ? Complete (Framework) |

### ?? Settings & Customization

| Feature | Description | Status |
|---------|-------------|--------|
| **Audio Controls** | Music and SFX volume | ? Complete |
| **Touch Controls** | Virtual joystick for mobile | ? Complete |
| **Camera Modes** | Third-person / first-person | ? Complete |
| **Difficulty Scaling** | Casual (ages 10-80) | ? Complete |

---

## ??? Tech Stack

### Web Version

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI framework | 18.3 |
| **Three.js** | 3D graphics | Latest |
| **React Three Fiber** | React wrapper for Three.js | Latest |
| **React Three Drei** | Three.js helpers | Latest |
| **Zustand** | State management | 5.0 |
| **TypeScript** | Type safety | 5.6 |
| **Vite** | Build tool & dev server | 5.4 |
| **TailwindCSS** | Styling | 3.4 |

### Backend (Shared)

| Technology | Purpose | Version |
|------------|---------|---------|
| **Express.js** | HTTP server | 4.21 |
| **TypeScript** | Type safety | 5.6 |
| **Drizzle ORM** | Database ORM | 0.39 |
| **PostgreSQL (Neon)** | Database | Latest |
| **WebSocket (ws)** | Real-time features | 8.18 |

### Unreal Version

| Technology | Purpose | Version |
|------------|---------|---------|
| **Unreal Engine** | Game engine | 5.7 |
| **C++** | Core systems | C++20 |
| **Blueprints** | Visual scripting | Native |
| **UMG** | UI system | Native |
| **Enhanced Input** | Input system | Native |
| **Chaos Physics** | Physics simulation | Native |

---

## ?? Development Workflow

### Daily Development Routine

**Morning Setup:**
```bash
# 1. Pull latest changes
git pull origin main

# 2. Start backend (Terminal 1)
npm run dev

# 3A. Test web version
# Open http://localhost:5000

# 3B. Test Unreal version (Terminal 2)
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
# Save everything
# Test both versions
# Verify API endpoints work

git add .
git commit -m "[web/unreal/shared] feat: description"
git push origin main
```

### Commit Message Format

```
[platform] type: description

Platforms:
  - [web]      Web version only
  - [unreal]   Unreal version only
  - [shared]   Backend/database
  - [both]     Both versions
  - [docs]     Documentation

Types:
  - feat:      New feature
  - fix:       Bug fix
  - refactor:  Code refactoring
  - docs:      Documentation
  - style:     Formatting
  - test:      Tests
  - chore:     Maintenance
```

**Examples:**
```
[web] feat: added joystick sensitivity slider
[unreal] feat: implemented parade float AI
[shared] feat: added leaderboard API endpoint
[both] fix: corrected combo calculation
[docs] docs: updated Blueprint customization guide
```

---

## ?? Development Roadmap

### ? Completed (Web Version)
- [x] Complete player movement system
- [x] Parade floats with physics-based throwing
- [x] All collectible types (beads, doubloons, cups, etc.)
- [x] Combo system with color matching
- [x] Power-ups (speed boost, double points)
- [x] Competitor bots with AI
- [x] Aggressive NPCs
- [x] Obstacles
- [x] Complete UI/HUD
- [x] Audio system
- [x] Touch controls for mobile
- [x] Settings and save system
- [x] Cosmetic skins
- [x] Level progression

### ?? In Progress (Unreal Version)

**Phase 1: Foundation (Weeks 1-2)** ?
- [x] Project structure created
- [x] C++ player character class
- [x] C++ game mode class
- [ ] Player Blueprint (BP_ParadePlayer)
- [ ] Basic level design
- [ ] Test player movement

**Phase 2: Core Gameplay (Weeks 3-4)** ??
- [ ] Parade float C++ class
- [ ] Collectible C++ class
- [ ] Blueprint variants
- [ ] Catching mechanics
- [ ] Scoring system

**Phase 3: AI & Competition (Weeks 5-6)** ??
- [ ] Competitor bots
- [ ] Aggressive NPCs
- [ ] AI behavior trees
- [ ] Bot customization

**Phase 4: UI & UX (Weeks 7-8)** ??
- [ ] HUD widgets (UMG)
- [ ] Menu screens
- [ ] Settings system
- [ ] Touch controls

**Phase 5: Audio & Polish (Week 9)** ??
- [ ] Audio system
- [ ] Sound cues
- [ ] Visual effects
- [ ] Optimization

**Phase 6: Monetization (Week 10)** ??
- [ ] Skin system
- [ ] In-app purchases
- [ ] Ad integration
- [ ] Analytics

**Phase 7: Mobile Optimization (Week 11)** ??
- [ ] Touch controls
- [ ] Performance optimization
- [ ] UI scaling
- [ ] Device testing

**Phase 8: Launch (Week 12)** ??
- [ ] Final testing
- [ ] Bug fixes
- [ ] Platform builds
- [ ] Deployment

---

## ?? For Designers (Non-Technical)

### What You Can Customize Without Coding

**In Unreal Engine Blueprints:**

? **Movement Settings** (sliders 0-1000)
- Player speed
- Speed boost multiplier
- Rotation speed

? **Gameplay Balance** (sliders and formulas)
- Float speed per level
- Throw interval
- NPC count
- Obstacle count
- Combo window

? **Visual Appearance** (drag & drop)
- Character meshes (including MetaHumans!)
- Float meshes (custom or modular)
- Collectible models
- Materials and colors
- Particle effects

? **Audio Settings** (dropdown selectors)
- Sound cues
- Music tracks
- Volume levels
- 3D sound attenuation

? **UI Customization** (visual editor)
- Colors
- Fonts
- Layouts
- Animations

**See [UNREAL_BLUEPRINT_GUIDE.md](UNREAL_BLUEPRINT_GUIDE.md) for detailed instructions!**

---

## ?? Testing

### Web Version Testing

```bash
# Development
npm run dev
# Open http://localhost:5000

# Production build
npm run build
npm run start

# Type check
npm run check

# Database
npm run db:push
```

### Unreal Version Testing

```bash
# Play in Editor
# Open MardiGrasParade.uproject
# Press Alt+P

# Package for Windows
# File ? Package Project ? Windows (64-bit)

# Package for Mobile
# File ? Package Project ? Android
# File ? Package Project ? iOS (requires Mac)
```

### API Integration Testing

```bash
# Start backend
npm run dev

# Test endpoints
curl http://localhost:5000/api/leaderboard
curl http://localhost:5000/api/profile/123

# Monitor logs
# Watch terminal output for API calls
```

---

## ?? Performance Targets

### Web Version
- **Desktop:** 60 FPS @ 1080p on mid-range devices
- **Mobile:** 45 FPS on iPhone 11 / Galaxy S10
- **Load Time:** < 5 seconds

### Unreal Version
- **PC:** 60 FPS @ 1080p on GTX 1060 equivalent
- **Mobile High:** 60 FPS on iPhone 13+ / Galaxy S21+
- **Mobile Medium:** 45 FPS on iPhone 11 / Galaxy S10
- **Mobile Low:** 30 FPS on iPhone 8 / Galaxy S8

### Quality Targets
- **Crash-free rate:** >99%
- **Average session:** >5 minutes
- **Day 1 retention:** >40%
- **Day 7 retention:** >20%

---

## ?? Contributing

### For Developers

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes**
4. **Test thoroughly**
5. **Commit with proper format**
   ```bash
   git commit -m "[platform] type: description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create Pull Request**

### For Designers

1. **Check out [UNREAL_BLUEPRINT_GUIDE.md](UNREAL_BLUEPRINT_GUIDE.md)**
2. **Customize Blueprints** (no code required!)
3. **Test in Play mode** (Alt+P)
4. **Share screenshots** in team chat
5. **Submit changes** via pull request

### Code Style

**TypeScript/JavaScript:**
- Use TypeScript strict mode
- Prefer functional components
- Use meaningful variable names
- Comment complex logic

**C++:**
- Follow Unreal Engine coding standards
- Use `UPROPERTY` for Blueprint-exposed variables
- Comment public functions
- Mark functions `const` when appropriate

**Blueprints:**
- Use descriptive names
- Organize nodes with comments
- Collapse complex logic into functions
- Use Reroute nodes for clean connections

---

## ?? License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ?? Team & Contact

### Core Team
- **Project Lead:** Brandon Lundin
- **Repository:** [Nola-Developer-Incubator](https://github.com/FreeLundin/Nola-Developer-Incubator)

### Contact
- **GitHub Issues:** [Create Issue](https://github.com/FreeLundin/Nola-Developer-Incubator/issues)
- **Discussions:** [GitHub Discussions](https://github.com/FreeLundin/Nola-Developer-Incubator/discussions)

---

## ?? Acknowledgments

### Technology
- **Unreal Engine** by Epic Games
- **React Three Fiber** by Poimandres
- **Three.js** by Mr.doob
- **TailwindCSS** by Tailwind Labs
- **Drizzle ORM** by Drizzle Team

### Inspiration
- **Mardi Gras** - New Orleans tradition and culture
- **Parade Culture** - Celebration and community spirit

---

## ?? Additional Resources

### Learning Resources

**Unreal Engine:**
- [Official Documentation](https://docs.unrealengine.com)
- [Blueprint Visual Scripting](https://docs.unrealengine.com/blueprintapi)
- [C++ API Reference](https://docs.unrealengine.com/cpp)
- [Unreal Learning Portal](https://learn.unrealengine.com)

**Web Development:**
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Community

**Unreal Engine:**
- [Forums](https://forums.unrealengine.com)
- [Unreal Slackers Discord](https://unrealslackers.org)
- [r/unrealengine](https://reddit.com/r/unrealengine)

**Web Development:**
- [React Three Fiber Discord](https://discord.gg/poimandres)
- [Three.js Discourse](https://discourse.threejs.org)

### Tools & Assets

**3D Modeling:**
- [Blender](https://www.blender.org) - Free 3D creation suite
- [Unreal Marketplace](https://www.unrealengine.com/marketplace) - Assets and plugins

**Audio:**
- [Freesound](https://freesound.org) - Free sound effects
- [Incompetech](https://incompetech.com) - Royalty-free music

**Textures:**
- [Quixel Megascans](https://quixel.com/megascans) - Free with Unreal
- [Poly Haven](https://polyhaven.com) - Free textures and HDRIs

---

## ?? Quick Links

### Documentation
- ?? **[START_HERE.md](START_HERE.md)** - Your first stop for Unreal
- ?? **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Navigation hub
- ?? **[QUICK_START_UNREAL.md](QUICK_START_UNREAL.md)** - Setup guide
- ?? **[UNREAL_BLUEPRINT_GUIDE.md](UNREAL_BLUEPRINT_GUIDE.md)** - No-code customization
- ??? **[UNREAL_CONVERSION_PLAN.md](UNREAL_CONVERSION_PLAN.md)** - 12-week roadmap
- ?? **[RUNNING_BOTH_VERSIONS.md](RUNNING_BOTH_VERSIONS.md)** - Side-by-side guide
- ? **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Cheat sheet

### Project Resources
- ?? **[Live Demo](https://your-demo-url.com)** - Play web version online
- ?? **[Video Tutorial](https://your-video-url.com)** - Watch gameplay
- ?? **[Discord](https://your-discord-url.com)** - Join community
- ?? **[Contact](mailto:your-email@example.com)** - Get in touch

---

## ?? Let's Build Something Amazing!

This project combines the accessibility of web games with the power of native game engines, all while celebrating the vibrant Mardi Gras tradition!

**Choose your platform and start building:**

- ?? **Web Developer?** ? `npm run dev` and start coding!
- ?? **Unreal Developer?** ? Read [START_HERE.md](START_HERE.md) and build!
- ?? **Designer?** ? Check out [UNREAL_BLUEPRINT_GUIDE.md](UNREAL_BLUEPRINT_GUIDE.md)!
- ?? **Project Manager?** ? Review [UNREAL_CONVERSION_PLAN.md](UNREAL_CONVERSION_PLAN.md)!

---

<div align="center">

### ?? Laissez les bons temps rouler! ??

**Star ? this repo if you like the project!**

[![GitHub stars](https://img.shields.io/github/stars/FreeLundin/Nola-Developer-Incubator?style=social)](https://github.com/FreeLundin/Nola-Developer-Incubator/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/FreeLundin/Nola-Developer-Incubator?style=social)](https://github.com/FreeLundin/Nola-Developer-Incubator/network/members)

**Made with ?? in the spirit of Mardi Gras**

</div>
