# NDI_MardiGrasParade - Unreal Engine Conversion Plan

## ?? Executive Summary

This document provides a complete roadmap for converting the React Three.js NDI_MardiGrasParade to Unreal Engine 5, while maintaining the web version for broader accessibility.

**Project Goals:**
- ? Convert all gameplay features to Unreal Engine
- ? Maintain feature parity between web and Unreal versions
- ? Make Unreal version easily customizable for non-technical developers
- ? Run both versions side-by-side with shared backend
- ? Target platforms: PC (Steam), iOS, Android, Web

---

## ??? Project Structure Overview

### Current React Three.js Structure
```
<<<<<<< HEAD
Mardi-Gras-Parade-Game/
=======
NDI_MardiGrasParade/
>>>>>>> origin/main
??? client/       # React frontend
?   ??? src/
?       ??? components/game/  # Game components
?       ??? lib/stores/       # State management
? ??? hooks/          # React hooks
??? server/      # Express backend
??? shared/                 # Database schema
```

### New Unreal Engine Structure (Side-by-Side)
```
<<<<<<< HEAD
Mardi-Gras-Parade-Game/
=======
NDI_MardiGrasParade/
>>>>>>> origin/main
??? client/         # React frontend (EXISTING)
??? server/       # Express backend (SHARED)
??? shared/        # Database schema (SHARED)
??? unreal/            # NEW: Unreal Engine project
    ??? MardiGrasParade/    # Unreal project files
    ?   ??? Source/ # C++ source code
    ?   ??? Content/        # Assets and Blueprints
    ?   ??? Config/         # Project configuration
    ?   ??? Plugins/        # Third-party plugins
    ??? Docs/     # Unreal-specific documentation
```

---

## ?? Feature Conversion Matrix

| Feature | React Three.js Location | Unreal Engine Implementation | Complexity | Blueprint/C++ |
|---------|------------------------|------------------------------|------------|---------------|
| **Player Movement** | `Player.tsx` | `BP_ParadePlayer` + `AParadePlayerCharacter` | Medium | Both |
| **Camera System** | `GameCamera.tsx` | `BP_ParadeCamera` + `UParadeCameraComponent` | Low | Both |
| **Parade Floats** | `ParadeFloat.tsx` | `BP_ParadeFloat` + `AParadeFloat` | Medium | Both |
| **Collectibles** | `Collectible.tsx` | `BP_Collectible` + `ACollectible` | Medium | Both |
| **Competitor Bots** | `CompetitorBot.tsx` | `BP_CompetitorBot` + AI Behavior Tree | High | Both |
| **Aggressive NPCs** | `AggressiveNPC.tsx` | `BP_AggressiveNPC` + AI Controller | High | Both |
| **Obstacles** | `Obstacle.tsx` | `BP_Obstacle` + `AObstacle` | Low | Blueprint |
| **Game State** | `useParadeGame.tsx` | `AParadeGameMode` + `AParadeGameState` | High | C++ |
| **UI/HUD** | `GameUI.tsx` | UMG Widgets (`WBP_GameHUD`) | Medium | Blueprint |
| **Audio** | `AudioManager.tsx` | `BP_AudioManager` + Sound Cues | Low | Blueprint |
| **Touch Controls** | `TouchControls.tsx` | `WBP_VirtualJoystick` | Low | Blueprint |
| **Settings** | `SettingsModal.tsx` | `WBP_SettingsMenu` + Save Game | Medium | Both |
| **Monetization** | `AdRewardScreen.tsx` | Plugin Integration + `UMonetizationManager` | High | Both |

---

## ?? Development Phases

### **Phase 1: Foundation (Week 1-2)** ???

#### 1.1 Project Setup
- [ ] Install Unreal Engine 5.4 or later
- [ ] Create new Third Person C++ project
- [ ] Set up Git LFS for Unreal assets
- [ ] Configure project for mobile platforms
- [ ] Install required plugins

**Deliverables:**
- Empty Unreal project that compiles
- Git repository structure
- Initial documentation

#### 1.2 Core C++ Framework
- [ ] Create `AParadePlayerCharacter` class
- [ ] Create `AParadeGameMode` class
- [ ] Create `AParadeGameState` class
- [ ] Create `UParadeSaveGame` class
- [ ] Set up Enhanced Input system

**Files to Create:**
```
Source/MardiGrasParade/
??? Characters/
?   ??? ParadePlayerCharacter.h
?   ??? ParadePlayerCharacter.cpp
??? GameModes/
?   ??? ParadeGameMode.h
?   ??? ParadeGameMode.cpp
?   ??? ParadeGameState.h
?   ??? ParadeGameState.cpp
??? SaveGame/
?   ??? ParadeSaveGame.h
?   ??? ParadeSaveGame.cpp
??? MardiGrasParade.Build.cs
```

---

### **Phase 2: Core Gameplay (Week 3-4)** ??

#### 2.1 Player & Movement
**React Component:** `client/src/components/game/Player.tsx`

**Unreal Implementation:**
- [ ] C++ base class: `AParadePlayerCharacter`
- [ ] Blueprint: `BP_ParadePlayer`
- [ ] Input Actions: `IA_Move`, `IA_ClickMove`
- [ ] Movement Component with speed boost support

**Key Features:**
- WASD/Arrow key movement
- Click-to-move functionality
- Joystick support for mobile
- Speed boost power-up (1.5x multiplier)
- Collision detection

**C++ Code Snippet:**
```cpp
// ParadePlayerCharacter.h
UCLASS()
class AParadePlayerCharacter : public ACharacter
{
    GENERATED_BODY()
    
public:
    // Exposed to Blueprint for easy customization
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Config")
    float BaseMoveSpeed = 600.0f;
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Config")
    float SpeedBoostMultiplier = 1.5f;
    
    UPROPERTY(BlueprintReadWrite, Category = "Game|Color")
    ECollectibleColor PlayerColor;
  
 // Blueprint callable functions
    UFUNCTION(BlueprintCallable, Category = "Movement")
    void SetMoveTarget(FVector TargetLocation);
    
 UFUNCTION(BlueprintCallable, Category = "PowerUps")
    void ActivateSpeedBoost(float Duration);
};
```

**Blueprint Setup (Non-Technical Friendly):**
```
BP_ParadePlayer Blueprint Variables (All editable):
??? Base Move Speed: 600 (slider 0-1000)
??? Speed Boost Multiplier: 1.5 (slider 1.0-3.0)
??? Player Color: Dropdown (Beads/Doubloon/Cup)
??? Catch Radius: 150 (slider 50-500)
??? Player Mesh: Static/Skeletal Mesh selector
```

#### 2.2 Camera System
**React Component:** `client/src/components/game/GameCamera.tsx`

**Unreal Implementation:**
- [ ] C++ component: `UParadeCameraComponent`
- [ ] Blueprint: `BP_ParadeCamera`
- [ ] Camera modes: Third Person / First Person toggle
- [ ] Smooth camera follow

**Blueprint Variables (Designer Friendly):**
```
BP_ParadeCamera:
??? Camera Mode: Dropdown (Third Person / First Person)
??? Third Person Distance: 400 (slider)
??? Third Person Height: 60 (slider)
??? Camera Smoothness: 5.0 (slider 0-10)
??? Field of View: 90 (slider 60-120)
??? Enable Camera Toggle: Checkbox
```

#### 2.3 Parade Floats
**React Component:** `client/src/components/game/ParadeFloat.tsx`

**Unreal Implementation:**
- [ ] C++ class: `AParadeFloat`
- [ ] Blueprint: `BP_ParadeFloat` (designer-friendly)
- [ ] Spline-based movement system
- [ ] Collectible throwing system
- [ ] Collision detection

**Blueprint Properties (Easy to Customize):**
```
BP_ParadeFloat:
??? Visual
?   ??? Float Mesh: Static Mesh selector
?   ??? Float Color: Color picker
?   ??? Particle Effect: Particle System selector
?   ??? Float Scale: Vector (1, 1, 1)
??? Movement
?   ??? Move Speed: 200 (slider 50-500) cm/s
?   ??? Follow Spline: Spline Component reference
?   ??? Loop Movement: Checkbox
??? Throwing
?   ??? Throw Interval: 3.0 seconds (slider 1-10)
?   ??? Throw Force: 500 (slider 100-1000)
?   ??? Throw Angle: 45 degrees (slider 0-90)
?   ??? Collectible Types: Array of Blueprint Classes
??? Collision
    ??? Collision Width: 250 cm (slider)
    ??? Collision Length: 300 cm (slider)
    ??? Eliminate Player on Hit: Checkbox (default: true)
```

**C++ Interface:**
```cpp
UCLASS(Blueprintable)
class AParadeFloat : public AActor
{
    GENERATED_BODY()

public:
    // Designer-friendly properties
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Float|Movement", meta = (UIMin = "50", UIMax = "500"))
    float MoveSpeed = 200.0f;
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Float|Throwing", meta = (UIMin = "1", UIMax = "10"))
    float ThrowInterval = 3.0f;
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Float|Throwing")
 TArray<TSubclassOf<class ACollectible>> CollectibleTypes;
    
    // Blueprint implementable events
    UFUNCTION(BlueprintImplementableEvent, Category = "Float|Events")
    void OnFloatPassed();
    
    UFUNCTION(BlueprintImplementableEvent, Category = "Float|Events")
    void OnThrewCollectible(ACollectible* Collectible);
};
```

#### 2.4 Collectible System
**React Component:** `client/src/components/game/Collectible.tsx`

**Unreal Implementation:**
- [ ] C++ base class: `ACollectible`
- [ ] Blueprints for each type:
  - `BP_Collectible_Beads`
  - `BP_Collectible_Doubloon`
  - `BP_Collectible_Cup`
  - `BP_Collectible_KingCake`
  - `BP_Collectible_SpeedBoost`
  - `BP_Collectible_DoublePoints`

**Blueprint Structure (Non-Technical Friendly):**
```
BP_Collectible_Beads (Example):
??? Visual Settings
?   ??? Mesh: Static Mesh (Beads Chain)
?   ??? Material: Material Instance (Purple/Green/Gold)
?   ??? Scale: 1.0 (slider 0.5-3.0)
?   ??? Glow Effect: Particle System
??? Gameplay Settings
?   ??? Type: Beads (read-only)
?   ??? Point Value: 1 (integer)
?   ??? Color Match Bonus: 3x (read-only)
?   ??? Catch Radius: 100 cm (slider)
??? Physics Settings
?   ??? Mass: 0.5 kg (slider 0.1-5.0)
?   ??? Bounce: 0.3 (slider 0-1)
?   ??? Air Drag: 1.0 (slider 0-5)
?   ??? Enable Gravity: Checkbox
??? Audio Settings
    ??? Catch Sound: Sound Cue
    ??? Impact Sound: Sound Cue
    ??? Volume: 1.0 (slider 0-1)
```

---

### **Phase 3: AI & Competition (Week 5-6)** ??

#### 3.1 Competitor Bots
**React Component:** `client/src/components/game/CompetitorBot.tsx`

**Unreal Implementation:**
- [ ] C++ class: `ACompetitorBot`
- [ ] AI Controller: `ACompetitorBotAIController`
- [ ] Behavior Tree: `BT_CompetitorBot`
- [ ] Blackboard: `BB_CompetitorBot`
- [ ] Blueprints for 6 bots (King Rex, Queen Zulu, etc.)

**Bot Configuration (Designer-Friendly):**
```
BP_CompetitorBot_KingRex (Example):
??? Identity
?   ??? Bot Name: "King Rex" (text)
?   ??? Bot Color: Red (color picker)
?   ??? Character Mesh: Skeletal Mesh
?   ??? Bot Icon: Texture
??? AI Behavior (Easy Difficulty Curve)
?   ??? Reaction Time: 0.5 seconds (slider 0.1-2.0)
?   ??? Movement Speed: 500 cm/s (slider 300-800)
?   ??? Detection Radius: 800 cm (slider 500-1500)
?   ??? Catch Skill: 70% (slider 0-100)
?   ??? Claim Priority: Medium (dropdown: Low/Medium/High)
??? Personality Traits (Affects Behavior)
?   ??? Aggressiveness: 50 (slider 0-100)
?   ??? Patience: 70 (slider 0-100)
? ??? Cooperation: 30 (slider 0-100)
??? Visual Customization
    ??? Material: Material Instance
    ??? Trail Effect: Particle System
    ??? Animation Set: Animation Blueprint
```

**Behavior Tree Tasks (Visual Scripting - No Code Required):**
```
BT_CompetitorBot:
Root
??? Sequence: Main Loop
?   ??? Service: Update Nearby Collectibles (runs every 0.5s)
?   ?   ??? Config: Detection Radius = Bot's Detection Radius variable
?   ??? Decorator: Has Valid Target?
?   ??? Task: Select Best Collectible
?   ?   ??? Config: Priority = Bot's Claim Priority variable
?   ??? Task: Move To Collectible
?   ?   ??? Config: Speed = Bot's Movement Speed variable
? ??? Task: Attempt Catch
?   ?   ??? Config: Success Rate = Bot's Catch Skill variable
?   ??? Task: Celebrate (if caught)
??? Fallback: Idle Behavior
    ??? Task: Wander Around Street
```

#### 3.2 Aggressive NPCs
**React Component:** `client/src/components/game/AggressiveNPC.tsx`

**Unreal Implementation:**
- [ ] C++ class: `AAggressiveNPC`
- [ ] AI Controller: `AAggressiveNPCAIController`
- [ ] Behavior Tree: `BT_AggressiveNPC`
- [ ] Blueprint: `BP_AggressiveNPC`

**NPC Configuration (Designer-Friendly):**
```
BP_AggressiveNPC:
??? Visual Style
?   ??? Mesh Type: Cube / Sphere (dropdown)
?   ??? Material: Black & White Checker (Material Instance)
?   ??? Glow Color (When Chasing): Red (color picker)
?   ??? Scale: 1.0 (slider 0.5-2.0)
?   ??? Trail Effect: Particle System
??? Behavior Settings
?   ??? Idle Move Speed: 200 cm/s (slider)
?   ??? Chase Speed: 800 cm/s (slider)
?   ??? Chase Duration: 5 seconds (slider 3-10)
?   ??? Detection Radius: 500 cm (slider)
?   ??? Damage to Player: 1 point (integer)
??? Difficulty Scaling (Per Level)
?   ??? Level 1 NPCs: 0 (integer)
?   ??? Level 2-3 NPCs: 1 (integer)
?   ??? Level 4 NPCs: 2 (integer)
?   ??? Scale Rate: +1 every 2 levels (formula)
??? Audio Settings
    ??? Chase Start Sound: Sound Cue
    ??? Chase Loop Sound: Sound Cue
    ??? Hit Player Sound: Sound Cue
```

---

### **Phase 4: UI & UX (Week 7-8)** ??

#### 4.1 Main HUD
**React Component:** `client/src/components/game/GameUI.tsx`

**Unreal Implementation:**
- [ ] UMG Widget: `WBP_GameHUD`
- [ ] C++ class: `UParadeHUD`

**Widget Structure (Visual Editor - No Code):**
```
WBP_GameHUD (Canvas Panel):
??? Top Bar (Horizontal Box)
?   ??? Score Display
?   ?   ??? Icon: Image (Trophy)
?   ?   ??? Score Text: Text Block (Bind: GetScore)
?   ?   ??? Target Score: Text Block (Bind: GetTargetScore)
?   ??? Level Display
?   ?   ??? Icon: Image (Star)
?   ?   ??? Level Text: Text Block (Bind: GetLevel)
?   ??? Coins Display
?       ??? Icon: Image (Coin)
?       ??? Coins Text: Text Block (Bind: GetCoins)
??? Combo Display (Overlay)
?   ??? Background: Image (Glow when combo > 0)
?   ??? Combo Text: Text Block (Bind: GetCombo)
?   ??? Multiplier Text: "x3 COLOR MATCH!" (Bind: GetComboText)
?   ??? Animations: Pulse, Scale up
??? Progress Bar (Bottom)
?   ??? Label: "Floats Passed"
?   ??? Progress Bar: (Bind: GetFloatProgress)
?   ??? Count Text: "5/10" (Bind: GetFloatCountText)
??? Power-Up Indicators (Right Side)
?   ??? Speed Boost Icon (Visibility: Bind)
?   ??? Double Points Icon (Visibility: Bind)
?   ??? Timer Text (Bind: GetPowerUpTimeLeft)
??? Bot Leaderboard (Left Side - Optional)
?   ??? Bot 1: Name + Catches
?   ??? Bot 2: Name + Catches
?   ??? ...
?   ??? Bot 6: Name + Catches
??? Settings Button (Top Right)
    ??? Button: Opens Settings Menu
```

**Blueprint Bindings (No C++ Required):**
```cpp
// Event Graph in WBP_GameHUD
Get Score (Text Binding):
??? Get Game State
??? Cast to ParadeGameState
??? Get Score variable
??? Format Text: "{Score}"

Get Float Progress (Progress Bar Binding):
??? Get Game State
??? Cast to ParadeGameState
??? FloatsPassed / TotalFloats
??? Return Float (0.0 - 1.0)
```

#### 4.2 Other UI Screens
- [ ] `WBP_TutorialScreen` - Game instructions
- [ ] `WBP_WinScreen` - End game results
- [ ] `WBP_SettingsMenu` - Audio, controls, graphics settings
- [ ] `WBP_CosmeticShop` - Skin purchasing
- [ ] `WBP_AdRewardScreen` - Monetization offers
- [ ] `WBP_VirtualJoystick` - Mobile controls

**All widgets designed in UMG Visual Editor - minimal code required**

---

### **Phase 5: Audio & Polish (Week 9)** ??

#### 5.1 Audio System
**React Component:** `client/src/components/game/AudioManager.tsx`

**Unreal Implementation:**
- [ ] Blueprint: `BP_AudioManager`
- [ ] Sound Cues for all game events
- [ ] Audio settings integration

**Sound Assets Needed:**
```
Content/Audio/
??? Music/
?   ??? SC_ParadeMusic_Jazz.uasset (Background loop)
?   ??? SC_ParadeMusic_Victory.uasset (Win screen)
??? SFX/
?   ??? SC_Catch_Beads.uasset
?   ??? SC_Catch_Doubloon.uasset
?   ??? SC_Catch_Cup.uasset
?   ??? SC_Catch_KingCake.uasset (special sound)
?   ??? SC_Catch_PowerUp.uasset
?   ??? SC_Combo_2x.uasset
?   ??? SC_Combo_3x.uasset (escalating)
?   ??? SC_Combo_5x.uasset (bigger)
?   ??? SC_Hit_Obstacle.uasset
?   ??? SC_Hit_NPC.uasset
?   ??? SC_PowerUp_Activate.uasset
?   ??? SC_LevelUp.uasset
?   ??? SC_FloatPassed.uasset
??? Ambient/
    ??? SC_Crowd_Loop.uasset
    ??? SC_Street_Ambience.uasset
```

**BP_AudioManager Configuration (Designer-Friendly):**
```
BP_AudioManager:
??? Music Settings
?   ??? Background Music: Sound Cue
?   ??? Music Volume: 0.7 (slider 0-1)
?   ??? Fade In Duration: 2 seconds
?   ??? Enable Music: Checkbox
??? SFX Settings
?   ??? Master SFX Volume: 1.0 (slider 0-1)
?   ??? UI Sounds Volume: 0.8 (slider 0-1)
?   ??? Gameplay Sounds Volume: 1.0 (slider 0-1)
?   ??? Enable SFX: Checkbox
??? Sound Cue Assignments (Dropdown selectors for each)
?   ??? Catch Sounds: Array[6] of Sound Cues
?   ??? Combo Sounds: Array[5] of Sound Cues
?   ??? Power-Up Sounds: Array[2] of Sound Cues
?   ??? Event Sounds: Array[10] of Sound Cues
??? Advanced Settings
    ??? 3D Sound Attenuation: Attenuation Settings
??? Reverb Settings: Reverb Effect
    ??? Audio Occlusion: Checkbox
```

---

### **Phase 6: Monetization & Platform Features (Week 10)** ??

#### 6.1 In-App Purchases (Mobile)
- [ ] Plugin: Unreal Engine Online Subsystem (iOS/Android)
- [ ] C++ class: `UMonetizationManager`
- [ ] Blueprint: `BP_MonetizationManager`

**Product Catalog (Designer-Friendly):**
```
BP_MonetizationManager:
??? Skins Store
?   ??? Golden Skin: $0.99 or 100 coins
?   ??? Rainbow Skin: $1.99 or 150 coins
?   ??? Ghost Skin: $2.99 or 200 coins
?   ??? King Skin: $3.99 or 250 coins
?   ??? Jester Skin: $2.99 or 200 coins
??? Coin Packs
?   ??? Small Pack: 50 coins - $0.99
?   ??? Medium Pack: 150 coins - $1.99 (20% bonus)
?   ??? Large Pack: 350 coins - $3.99 (40% bonus)
?   ??? Mega Pack: 1000 coins - $9.99 (60% bonus)
??? Ad Settings
    ??? Rewarded Ad Provider: AdMob / Unity Ads (dropdown)
    ??? Ad Frequency: Every 3 game overs
    ??? Reward Amount: 10 coins
    ??? Enable Ads: Checkbox
```

#### 6.2 Save/Load System
**React Feature:** LocalStorage + Backend sync

**Unreal Implementation:**
- [ ] C++ class: `UParadeSaveGame`
- [ ] Blueprint functions for save/load
- [ ] Cloud save integration (optional)

**Save Data Structure:**
```cpp
UCLASS()
class UParadeSaveGame : public USaveGame
{
    GENERATED_BODY()

public:
 UPROPERTY(VisibleAnywhere, Category = "Stats")
    int32 HighScore = 0;
    
    UPROPERTY(VisibleAnywhere, Category = "Stats")
    int32 TotalCoins = 0;
    
    UPROPERTY(VisibleAnywhere, Category = "Stats")
    int32 HighestLevel = 1;
    
    UPROPERTY(VisibleAnywhere, Category = "Cosmetics")
    TArray<FString> UnlockedSkins;
    
    UPROPERTY(VisibleAnywhere, Category = "Cosmetics")
    FString EquippedSkin = "Default";
    
    UPROPERTY(VisibleAnywhere, Category = "Settings")
    float MusicVolume = 0.7f;
  
    UPROPERTY(VisibleAnywhere, Category = "Settings")
    float SFXVolume = 1.0f;
    
  UPROPERTY(VisibleAnywhere, Category = "Settings")
    bool bJoystickEnabled = false;
    
    UPROPERTY(VisibleAnywhere, Category = "Settings")
    int32 GraphicsQuality = 2; // 0=Low, 1=Medium, 2=High, 3=Epic
};
```

---

### **Phase 7: Mobile Optimization (Week 11)** ??

#### 7.1 Touch Controls
**React Component:** `client/src/components/game/TouchControls.tsx`

**Unreal Implementation:**
- [ ] UMG Widget: `WBP_VirtualJoystick`
- [ ] Blueprint: `BP_MobileTouchController`
- [ ] Responsive UI scaling

**Virtual Joystick Setup (UMG):**
```
WBP_VirtualJoystick:
??? Left Joystick (Movement)
?   ??? Background Image: Circle (semi-transparent)
?   ??? Stick Image: Circle (smaller)
?   ??? Dead Zone: 0.2 (slider 0-0.5)
?   ??? Max Range: 100 pixels
?   ??? Visual Feedback: Glow on touch
??? Right Side (Actions)
? ??? Catch Button: Button (if needed)
?   ??? Camera Toggle: Button (small icon)
??? Settings
    ??? Joystick Opacity: 0.6 (slider 0-1)
    ??? Joystick Size: 1.0 (slider 0.5-2.0)
    ??? Joystick Position X: 100 pixels from left
    ??? Joystick Position Y: 100 pixels from bottom
```

#### 7.2 Performance Optimization
- [ ] Mobile scalability settings
- [ ] LOD (Level of Detail) for meshes
- [ ] Texture streaming
- [ ] Particle effect scaling
- [ ] Shadow quality adjustment

**Mobile Scalability Presets:**
```
Project Settings > Scalability > Mobile:
??? Low (Older devices - iPhone 8, Galaxy S8)
?   ??? Resolution: 50% scale
?   ??? Shadows: Off
?   ??? Post Processing: Low
?   ??? Particles: 50% density
?   ??? Target FPS: 30
??? Medium (Mid-range - iPhone 11, Galaxy S10)
?   ??? Resolution: 75% scale
?   ??? Shadows: Dynamic, no cascades
?   ??? Post Processing: Medium
?   ??? Particles: 75% density
?   ??? Target FPS: 45
??? High (Flagship - iPhone 15, Galaxy S24)
    ??? Resolution: 100% scale
    ??? Shadows: Full dynamic
    ??? Post Processing: High
    ??? Particles: 100% density
    ??? Target FPS: 60
```

---

### **Phase 8: Testing & Deployment (Week 12)** ??

#### 8.1 Platform Builds
- [ ] Windows (x64) - Steam
- [ ] iOS - App Store
- [ ] Android - Google Play
- [ ] macOS (optional) - Steam/App Store

#### 8.2 Testing Checklist
- [ ] Gameplay balance testing (ages 10-80 target)
- [ ] Performance testing on target devices
- [ ] Save/load testing
- [ ] Monetization testing
- [ ] Cross-platform UI testing
- [ ] Accessibility testing

---

## ?? Asset Creation Guide

### 3D Models Needed
```
Content/Meshes/
??? Characters/
?   ??? SM_Player_Default.fbx
?   ??? SM_Player_Golden.fbx (variant)
?   ??? SM_Bot_KingRex.fbx
?   ??? SM_Bot_QueenZulu.fbx
?   ??? ... (4 more bots)
??? Floats/
?   ??? SM_Float_Base.fbx
?   ??? SM_Float_Decoration_01.fbx (modular)
?   ??? SM_Float_Decoration_02.fbx
??? Collectibles/
?   ??? SM_Beads.fbx
?   ??? SM_Doubloon.fbx
?   ??? SM_Cup.fbx
?   ??? SM_KingCake.fbx
? ??? SM_PowerUp_Orb.fbx
??? Environment/
?   ??? SM_Building_French_Quarter_01.fbx
?   ??? SM_Street_Straight.fbx
?   ??? SM_Lamppost.fbx
?   ??? SM_Crowd_Person (variations)
??? Props/
    ??? SM_Obstacle_Cone.fbx
    ??? SM_Obstacle_Barrier.fbx
    ??? SM_AggressiveNPC_Cube.fbx
```

### Materials & Textures
```
Content/Materials/
??? Characters/
?   ??? M_Player_Default (PBR Material)
?   ?   ??? T_Player_BaseColor.png
?   ?   ??? T_Player_Normal.png
?   ?   ??? T_Player_ORM.png (Occlusion/Roughness/Metallic)
?   ?   ??? MI_Player_Variants (Material Instances)
?   ??? M_Bot (shared bot material)
??? Environment/
?   ??? M_Street_Asphalt
?   ??? M_Building_Brick
?   ??? M_BuildingWindow_Glass
??? Collectibles/
?   ??? M_Beads_Purple
?   ??? M_Beads_Green
?   ??? M_Beads_Gold
?   ??? M_Doubloon_Gold
?   ??? M_Cup_Plastic
?   ??? M_KingCake
??? Effects/
    ??? M_PowerUp_Glow (Emissive)
    ??? M_Trail_Neon
    ??? M_Confetti
```

**Asset Creation Tools:**
- Blender (Free) - 3D modeling
- Substance Painter - Texturing
- Mixamo - Character animations
- Quixel Megascans - Environment assets (Unreal Marketplace - Free)

---

## ?? Technical Configuration

### Unreal Project Settings

#### Project Settings to Configure
```
Edit > Project Settings:
??? Maps & Modes
?   ??? Default GameMode: BP_ParadeGameMode
? ??? Default Pawn: BP_ParadePlayer
?   ??? Game Instance: BP_ParadeGameInstance
??? Input
?   ??? Default Input Component: Enhanced Input
?   ??? Input Mapping Context: IMC_ParadeGame
??? Engine > Rendering
?   ??? Forward Shading: Enabled (better mobile performance)
?   ??? Mobile HDR: Enabled
?   ??? Mobile MSAA: 2x (or 4x for high-end)
??? Platforms > iOS
?   ??? Bundle Identifier: com.yourcompany.mardigrasparade
?   ??? Minimum iOS Version: 14.0
?   ??? Orientation: Landscape
??? Platforms > Android
?   ??? Package Name: com.yourcompany.mardigrasparade
?   ??? Minimum SDK Version: 26
?   ??? Target SDK Version: 33
??? Plugins (Enable these)
    ??? Enhanced Input
    ??? Online Subsystem (iOS/Android)
    ??? Online Subsystem Google Play
    ??? Online Subsystem iOS
    ??? Android File Server (for development)
    ??? Gameplay Abilities (optional, for complex power-ups)
```

---

## ?? Conversion Priority Matrix

| Priority | Feature | Reason | Week |
|----------|---------|--------|------|
| **P0 - Critical** | Player Movement | Core gameplay | 2 |
| **P0 - Critical** | Parade Floats | Core gameplay | 3 |
| **P0 - Critical** | Collectibles | Core gameplay | 3 |
| **P0 - Critical** | Game State | Core gameplay | 2 |
| **P1 - High** | Basic UI/HUD | User feedback | 7 |
| **P1 - High** | Competitor Bots | Competitive element | 5 |
| **P1 - High** | Audio System | Polish | 9 |
| **P2 - Medium** | Aggressive NPCs | Challenge | 6 |
| **P2 - Medium** | Camera Toggle | UX feature | 4 |
| **P2 - Medium** | Touch Controls | Mobile support | 11 |
| **P3 - Low** | Monetization | Revenue | 10 |
| **P3 - Low** | Advanced UI | Polish | 8 |
| **P3 - Low** | Cloud Saves | Nice-to-have | 12 |

---

## ?? Learning Resources

### For Non-Technical Designers

**Blueprint Visual Scripting (No Coding):**
- Unreal Engine Official Tutorial: "Your First Hour in Unreal Engine 5.4"
- YouTube: "Unreal Engine Blueprint Tutorial for Beginners"
- Unreal Learning Portal: blueprint.unrealengine.com

**UMG (UI Design):**
- "UI Design with UMG" - Official Unreal Course
- YouTube: "Complete UMG Tutorial Series"

**Material Editor (Visual Shaders):**
- "Materials Master Learning" - Unreal Marketplace (Free)
- YouTube: "UE5 Materials for Beginners"

### For Developers

**C++ in Unreal:**
- "Unreal Engine C++ Fundamentals" - Tom Looman
- Documentation: docs.unrealengine.com/cpp

**AI & Behavior Trees:**
- "Artificial Intelligence in Unreal Engine" course
- "Behavior Trees Quick Start" - Official Docs

---

## ?? Success Metrics

### Performance Targets
- **PC**: 60 FPS @ 1080p on GTX 1060 or equivalent
- **Mobile High**: 60 FPS on iPhone 13+ / Galaxy S21+
- **Mobile Medium**: 45 FPS on iPhone 11 / Galaxy S10
- **Mobile Low**: 30 FPS on iPhone 8 / Galaxy S8

### Quality Targets
- Feature parity with React version: 100%
- Crash-free rate: >99%
- Average session length: >5 minutes
- Day 1 retention: >40%
- Day 7 retention: >20%

---

## ?? Next Steps

1. **Review this plan** with your team
2. **Set up Unreal Engine** development environment
3. **Create project repository** structure
4. **Begin Phase 1** - Foundation setup
5. **Regular syncs** - Weekly progress reviews

---

## ?? Support Resources

- **Unreal Developer Forums**: forums.unrealengine.com
- **Unreal Slackers Discord**: unrealslackers.org
- **GitHub Issues**: Track conversion progress and blockers
- **Weekly Team Sync**: Review progress and adjust timeline

---

**Document Version:** 1.0  
**Last Updated:** {{ Current Date }}  
**Next Review:** Week 4 of development
