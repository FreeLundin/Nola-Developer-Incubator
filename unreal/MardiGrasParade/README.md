# Mardi Gras Parade - Unreal Engine Project

## ?? Quick Start

1. **Generate Visual Studio project files:**
   - Right-click \$ProjectName.uproject\
   - Select "Generate Visual Studio project files"

2. **Open in Visual Studio:**
   - Open \$ProjectName.sln\
 - Build Solution (F7)
   - Wait for compilation to complete

3. **Open in Unreal Editor:**
   - Double-click \$ProjectName.uproject\
   - Press Play (Alt+P) to test

## ?? Project Structure

\\\
Source/MardiGrasParade/
??? Characters/          # Player character C++ classes
?   ??? ParadePlayerCharacter.h
?   ??? ParadePlayerCharacter.cpp
??? GameModes/     # Game mode C++ classes
? ??? ParadeGameMode.h
?   ??? ParadeGameMode.cpp
??? Collectibles/       # Collectible item classes (to be created)
??? AI/        # AI bot classes (to be created)

Content/
??? Blueprints/      # Blueprint classes
?   ??? Characters/     # BP_ParadePlayer
?   ??? Floats/  # BP_ParadeFloat
?   ??? Collectibles/ # BP_Collectible_[Type]
?   ??? AI/             # BP_CompetitorBot, BP_AggressiveNPC
?   ??? Core/       # BP_ParadeGameMode
??? Materials/ # Materials and material instances
??? Meshes/        # 3D models
??? Textures/           # Textures
??? Audio/       # Sounds and music
??? UI/      # UMG widgets
??? Maps/           # Levels (ParadeStreet_Level)
\\\

## ?? Next Steps

### Phase 1 - Foundation (Current)

- [x] Project structure created
- [x] C++ player character class
- [x] C++ game mode class
- [ ] Create player Blueprint (BP_ParadePlayer)
- [ ] Create basic level (ParadeStreet_Level)
- [ ] Test player movement

### Phase 2 - Core Gameplay

- [ ] Create parade float C++ class
- [ ] Create collectible C++ class
- [ ] Create Blueprint variants
- [ ] Implement catching mechanics
- [ ] Add scoring system

See \UNREAL_CONVERSION_PLAN.md\ in root directory for full roadmap.

## ??? Development Workflow

1. **Edit C++ code in Visual Studio**
2. **Compile (Ctrl+Alt+F11 in Unreal or F7 in VS)**
3. **Create/edit Blueprints in Unreal Editor**
4. **Test with Play (Alt+P)**
5. **Commit changes to Git**

## ?? Documentation

- **Full Conversion Plan:** ../UNREAL_CONVERSION_PLAN.md
- **Blueprint Guide:** ../UNREAL_BLUEPRINT_GUIDE.md
- **Quick Start:** ../QUICK_START_UNREAL.md
- **Running Both Versions:** ../RUNNING_BOTH_VERSIONS.md

## ?? Troubleshooting

**Project won't open:**
- Regenerate VS project files
- Build in Visual Studio first

**Code won't compile:**
- Delete Binaries/, Intermediate/, Saved/
- Regenerate VS project files
- Clean rebuild

**Need help?**
- Check troubleshooting docs
- Ask in team chat
- Create GitHub issue

## ?? Happy Developing!

Laissez les bons temps rouler! ??
