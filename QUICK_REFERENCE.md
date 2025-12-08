# ?? Unreal Engine Conversion - Quick Reference Card

## ?? Documentation Overview

| # | Document | For | Time | Purpose |
|---|----------|-----|------|---------|
| 1 | **DOCUMENTATION_INDEX.md** | Everyone | 5 min | Navigation hub |
| 2 | **README_DUAL_PLATFORM.md** | Everyone | 10 min | Project overview |
| 3 | **QUICK_START_UNREAL.md** | Developers | 15 min + setup | Environment setup |
| 4 | **UNREAL_CONVERSION_PLAN.md** | Developers/PMs | 45 min | Complete roadmap |
| 5 | **RUNNING_BOTH_VERSIONS.md** | Developers | 30 min | Side-by-side guide |
| 6 | **UNREAL_BLUEPRINT_GUIDE.md** | Designers | 40 min | No-code customization |

**Total Reading Time:** ~2.5 hours (one-time investment)

---

## ?? Quick Start (5 Minutes)

### I'm a Developer - Where do I start?
1. Read **DOCUMENTATION_INDEX.md** (this file) ? You are here
2. Read **README_DUAL_PLATFORM.md** for overview
3. Follow **QUICK_START_UNREAL.md** to setup
4. Reference **UNREAL_CONVERSION_PLAN.md** while coding
5. Check **RUNNING_BOTH_VERSIONS.md** for API integration

### I'm a Designer - Where do I start?
1. Read **DOCUMENTATION_INDEX.md** (this file) ? You are here
2. Read **README_DUAL_PLATFORM.md** for overview
3. Wait for developers to complete Phase 1-2
4. Study **UNREAL_BLUEPRINT_GUIDE.md** (your main guide!)
5. Experiment with Blueprints in Unreal Editor

### I'm a Project Manager - Where do I start?
1. Read **DOCUMENTATION_INDEX.md** (this file) ? You are here
2. Read **README_DUAL_PLATFORM.md** for overview
3. Study **UNREAL_CONVERSION_PLAN.md** for timeline
4. Track progress using Feature Conversion Matrix
5. Schedule weekly reviews with team

---

## ?? Common Tasks Quick Links

### Setup & Installation
- **Install Unreal Engine** ? QUICK_START_UNREAL.md - Step 1
- **Create Project** ? QUICK_START_UNREAL.md - Step 2
- **Setup Git LFS** ? QUICK_START_UNREAL.md - Step 4

### Development
- **Create C++ Classes** ? UNREAL_CONVERSION_PLAN.md - Phase 1
- **Create Blueprints** ? UNREAL_CONVERSION_PLAN.md - Phase 2
- **API Integration** ? RUNNING_BOTH_VERSIONS.md - Backend API section

### Customization (No Code)
- **Change Player Speed** ? UNREAL_BLUEPRINT_GUIDE.md - Task 1
- **Add New Float** ? UNREAL_BLUEPRINT_GUIDE.md - Task 2
- **Balance Difficulty** ? UNREAL_BLUEPRINT_GUIDE.md - Task 3
- **Customize UI** ? UNREAL_BLUEPRINT_GUIDE.md - UI Widgets section

### Testing
- **Run Web Version** ? RUNNING_BOTH_VERSIONS.md - Web Version Testing
- **Run Unreal Version** ? RUNNING_BOTH_VERSIONS.md - Unreal Version Testing
- **Test API** ? RUNNING_BOTH_VERSIONS.md - API Integration Testing

### Troubleshooting
- **Unreal Won't Open** ? QUICK_START_UNREAL.md - Issue 1
- **Code Won't Compile** ? QUICK_START_UNREAL.md - Issue 2
- **Backend Connection Failed** ? RUNNING_BOTH_VERSIONS.md - Troubleshooting section

---

## ?? 12-Week Timeline At-a-Glance

| Week | Phase | Key Deliverables |
|------|-------|------------------|
| 1-2 | **Foundation** | C++ classes, project setup, Git configured |
| 3-4 | **Core Gameplay** | Player, floats, collectibles working |
| 5-6 | **AI & Competition** | Bots, NPCs, AI behavior trees |
| 7-8 | **UI & UX** | HUD, menus, settings, polish |
| 9 | **Audio & Polish** | Sounds, music, visual effects |
| 10 | **Monetization** | Skins, IAP, ads (optional) |
| 11 | **Mobile Optimization** | Touch controls, performance |
| 12 | **Launch** | Testing, packaging, deployment |

---

## ?? For Designers: What You Can Change (No Coding!)

### Player Settings
- Movement speed (slider 0-1000)
- Catch radius (slider 50-500)
- Player color (dropdown: Beads/Doubloon/Cup)
- Mesh and materials

### Parade Floats
- Float speed (slider 50-500)
- Throw interval (slider 1-10 seconds)
- Throw force (slider 100-1000)
- What collectibles to throw (array)
- Visual appearance

### Game Balance
- Starting level (integer)
- Score targets (integer)
- Combo window (slider 1-10 seconds)
- Power-up duration (slider 5-20 seconds)
- NPC count per level (formula)
- Obstacle count per level (formula)

### UI & Audio
- Colors, fonts, sizes
- Button actions (visual scripting)
- Sound volumes (sliders 0-1)
- Music selection (dropdowns)

**All done in visual editors - zero coding required!** ?

---

## ?? For Developers: Key C++ Classes

### Core Classes
```cpp
// Characters
AParadePlayerCharacter - Player controller
ACompetitorBot - AI opponent
AAggressiveNPC - Chasing enemy

// Gameplay
AParadeFloat - Parade float actor
ACollectible - Throwable items
AObstacle - Moving hazards

// Game Management
AParadeGameMode - Game rules & spawning
AParadeGameState - Shared game state
UParadeSaveGame - Persistent data

// Systems
UParadeAPIClient - Backend communication
UParadeCameraComponent - Camera system
UMonetizationManager - IAP & ads
```

### Key Blueprint Classes
```
BP_ParadePlayer (from AParadePlayerCharacter)
BP_ParadeFloat (from AParadeFloat)
BP_Collectible_[Type] (from ACollectible)
BP_CompetitorBot_[Name] (from ACompetitorBot)
BP_AggressiveNPC (from AAggressiveNPC)
BP_ParadeGameMode (from AParadeGameMode)
```

---

## ?? Running Both Versions

### Terminal 1: Backend (Required)
```bash
cd C:\Users\BLund\source\repos\FreeLundin\Mardi-Gras-Parade-Game
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2: Web Version (Optional)
```bash
# Already served by Terminal 1
# Open browser: http://localhost:5000
```

### Unreal Editor: Unreal Version (Optional)
```bash
cd unreal/MardiGrasParade
start MardiGrasParade.uproject
# Press Alt+P to play in editor
```

**Both versions share the same backend!** ??

---

## ?? Emergency Troubleshooting

### Unreal Editor Won't Open
```bash
cd unreal/MardiGrasParade
# Right-click MardiGrasParade.uproject
# ? Generate Visual Studio project files
# Open MardiGrasParade.sln ? Build (F7)
# Try opening .uproject again
```

### Code Won't Compile
```bash
# Delete: Binaries/, Intermediate/, Saved/
# Regenerate VS project files
# Build in Visual Studio (F7)
```

### Backend Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000
# Kill process: taskkill /PID [PID] /F
# Restart: npm run dev
```

### Git LFS Issues
```bash
git lfs install
git lfs track "*.uasset"
git lfs track "*.umap"
git lfs ls-files  # Verify tracking
```

---

## ?? Getting Help

### Search Documentation
1. Open **DOCUMENTATION_INDEX.md**
2. Use Ctrl+F to search for keywords
3. Navigate to relevant document

### Ask Team
**Before asking:**
- Check documentation first
- Search previous questions
- Try troubleshooting steps

**When asking:**
- Explain what you're trying to do
- What you've tried
- Include error messages
- Attach screenshots if helpful

**Channels:**
- Technical: #unreal-dev
- Design: #design
- Backend: #backend-dev
- General: #general

---

## ? Pre-Flight Checklist

### Before Starting Development
- [ ] Read **DOCUMENTATION_INDEX.md**
- [ ] Read **README_DUAL_PLATFORM.md**
- [ ] Installed Unreal Engine 5.4+
- [ ] Installed Visual Studio 2022
- [ ] Installed Git LFS
- [ ] Cloned repository
- [ ] Read role-specific guide

### Before Committing Code
- [ ] Code compiles without errors
- [ ] Blueprints compile without errors
- [ ] Tested in Play mode
- [ ] No hardcoded values
- [ ] Added comments to code
- [ ] Organized Blueprint nodes
- [ ] Descriptive commit message

### Before Submitting PR
- [ ] Updated documentation if needed
- [ ] Tested both versions if shared code
- [ ] No merge conflicts
- [ ] Clear PR description
- [ ] Linked related issues
- [ ] Requested review

---

## ?? Success Metrics

### Technical
- Web: 60 FPS @ 1080p
- PC: 60 FPS @ 1080p (GTX 1060)
- Mobile: 45 FPS (iPhone 11)
- Crash-free: >99%

### Feature Parity
- Target: 100% parity
- Track in Feature Conversion Matrix
- Update weekly

### Timeline
- 12 weeks total
- Weekly milestones
- Buffer for testing/polish

---

## ?? Quick Wins

### Week 1 Goals (Achievable!)
- [ ] Unreal project created
- [ ] Opens without errors
- [ ] Can press Play (Alt+P)
- [ ] Default character moves
- [ ] Git tracking files

### Week 2 Goals
- [ ] Created C++ player class
- [ ] Created player Blueprint
- [ ] Player moves with WASD
- [ ] Backend connection tested
- [ ] First commit pushed

**Celebrate these milestones with your team!** ??

---

## ?? Platform Targets

### Web (Existing)
- **Browser:** Chrome, Firefox, Safari, Edge
- **Performance:** 60 FPS @ 1080p
- **Controls:** Keyboard + mouse, touch

### Unreal - PC
- **Platform:** Windows 10/11, Mac, Linux
- **Store:** Steam, Epic Games Store, itch.io
- **Performance:** 60 FPS @ 1080p (GTX 1060)

### Unreal - Mobile
- **iOS:** iPhone 11+, iPad Pro
- **Android:** Galaxy S10+, Pixel 4+
- **Performance:** 45-60 FPS
- **Store:** App Store, Google Play

### Unreal - Console (Future)
- **Platforms:** PlayStation 5, Xbox Series X/S, Nintendo Switch
- **Requirements:** Dev kits, platform certification
- **Timeline:** Post-launch (Phase 2)

---

## ?? Essential Links

### Documentation
- [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Start here
- [README_DUAL_PLATFORM.md](./README_DUAL_PLATFORM.md) - Project overview
- [QUICK_START_UNREAL.md](./QUICK_START_UNREAL.md) - Setup guide

### External Resources
- [Unreal Docs](https://docs.unrealengine.com) - Official documentation
- [Unreal Learning](https://learn.unrealengine.com) - Free courses
- [Unreal Forums](https://forums.unrealengine.com) - Community help

### Team Resources
- GitHub Repository: [Your Repo URL]
- Discord/Slack: [Your Team Chat]
- Project Board: [Your Kanban Board]

---

## ?? Pro Tips

### For Developers
- Compile frequently (catch errors early)
- Use Hot Reload for small changes only
- Comment your code (future you will thank you)
- Test in PIE (Play In Editor) constantly
- Commit small, working changes

### For Designers
- Save before testing (Ctrl+S)
- Name things descriptively
- Organize Blueprint nodes
- Use comments in visual scripts
- Test every change immediately

### For Everyone
- Read docs before asking
- Ask questions in appropriate channels
- Help teammates when you can
- Celebrate wins (big and small!)
- Have fun! ??

---

## ?? Project Stats

### Code
- **Lines of C++ (estimated):** ~5,000
- **Number of Blueprints:** ~30-40
- **Assets to create:** ~100-150
- **UI widgets:** ~10-15

### Timeline
- **Total duration:** 12 weeks
- **Full-time equivalent:** 3-4 developers
- **Part-time friendly:** Yes (extend timeline)
- **Buffer time:** 2 weeks built-in

### Learning Curve
- **Unreal beginner:** Allow extra time
- **Blueprint beginner:** Very gentle curve
- **C++ experienced:** Smooth transition
- **Game dev experience:** Big advantage

---

## ? Final Thoughts

You have everything you need to successfully convert this game to Unreal Engine!

### Remember:
- ?? Documentation is your friend
- ?? Ask for help when stuck
- ?? Follow the plan (but adapt as needed)
- ? Progress > Perfection
- ?? Celebrate milestones!

### Ready to Build?
1. Choose your starting document (see top of this card)
2. Set up your environment
3. Start with Phase 1
4. Have fun creating! ??

---

**Questions?** Check **DOCUMENTATION_INDEX.md** or ask in team chat!

**Good luck and happy developing!** ????

*Laissez les bons temps rouler!* ???
