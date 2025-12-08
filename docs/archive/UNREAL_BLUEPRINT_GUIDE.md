# Unreal Engine C++ and Blueprint Guide for Non-Technical Developers

## ?? Overview

This guide helps **non-technical designers** customize the Mardi Gras Parade game in Unreal Engine without writing code. We use a **hybrid approach**: C++ provides the foundation, and Blueprints provide visual customization.

---

## ?? Understanding the System

### What is C++?
- **Programming language** that provides the "engine" of the game
- Creates the **rules** and **logic** that can't change easily
- Written by programmers, used by designers

### What are Blueprints?
- **Visual scripting** - like connecting puzzle pieces
- Allows **customization** without coding
- Drag-and-drop interface
- **Perfect for non-programmers!**

### Hybrid Approach
```
C++ (Foundation - Programmers)
?
Blueprint Classes (Customization - Designers)
    ?
Level Design (Content - Everyone)
```

---

## ?? Designer-Friendly Blueprint Classes

### 1. Player Character: `BP_ParadePlayer`

**Location:** `Content/Blueprints/Characters/BP_ParadePlayer`

**What You Can Customize (No Code Required):**

#### Visual Settings
```
Open BP_ParadePlayer ? Details Panel:

Component Tab:
??? Mesh
?   ??? Skeletal Mesh: [Select your character model]
?   ??? Material: [Choose player color/skin]
? ??? Scale: [Make player bigger/smaller]
??? Camera
?   ??? Camera Distance: 400 (slider)
?   ??? Camera Height: 60 (slider)
?   ??? Field of View: 90 (slider)
??? Collision
    ??? Capsule Size: Adjust hitbox
    ??? Collision Preset: Pawn
```

#### Movement Settings
```
Class Defaults Tab (click "Class Defaults" button):

Movement Settings:
??? Base Move Speed: 600 (slider 0-1000)
?   ??? How fast player moves normally
??? Speed Boost Multiplier: 1.5 (slider 1.0-3.0)
?   ??? How much faster when power-up active
??? Rotation Speed: 10.0 (slider 1-20)
? ??? How quickly player turns
??? Acceleration: 2048 (slider 500-4000)
    ??? How quickly player starts/stops moving
```

#### Gameplay Settings
```
Game Settings:
??? Player Color: Dropdown (Beads / Doubloon / Cup)
?   ??? Determines 3x bonus points
??? Catch Radius: 150 cm (slider 50-500)
?   ??? How close to catch collectibles
??? Max Health: 3 (integer 1-10)
?   ??? How many hits before game over
??? Invincibility Duration: 2.0 seconds (slider 0-5)
    ??? After getting hit
```

#### Audio Settings
```
Audio Settings:
??? Footstep Sound: [Select Sound Cue]
??? Catch Sound: [Select Sound Cue]
??? Jump Sound: [Select Sound Cue]
??? Hurt Sound: [Select Sound Cue]
```

**How to Edit:**
1. Double-click `BP_ParadePlayer` in Content Browser
2. Click "Class Defaults" button (top toolbar)
3. Scroll through "Details" panel on right
4. Change values using sliders, dropdowns, or text boxes
5. Click "Compile" button (top toolbar)
6. Click "Save" button

**No coding required!** ?

---

### 2. Parade Float: `BP_ParadeFloat`

**Location:** `Content/Blueprints/Floats/BP_ParadeFloat`

**What You Can Customize:**

#### Visual Settings
```
Components Tab:
??? Float Mesh
?   ??? Static Mesh: [Select float model]
?   ??? Material 0: [Select color/pattern]
?   ??? Material 1: [Select secondary color]
?   ??? Scale: (1.0, 1.0, 1.0) - Make bigger/smaller
??? Decorations (Add multiple)
?   ??? Decoration 1: [Add flags, lights, etc.]
?   ??? Decoration 2: [Add more decorations]
?   ??? Decoration 3: [Keep adding!]
??? Particle Systems
?   ??? Confetti Effect: [Select particle system]
?   ??? Sparkle Effect: [Select particle system]
?   ??? Glow Effect: [Select particle system]
??? Lights
    ??? Point Light 1: Color, Intensity
    ??? Point Light 2: Color, Intensity
    ??? Spotlight: For dramatic effect
```

#### Movement Settings
```
Class Defaults:

Movement:
??? Move Speed: 200 cm/s (slider 50-500)
?   ??? How fast float moves down street
??? Follow Spline: [Select spline in level]
?   ??? Path the float follows
??? Loop Movement: Checkbox
?   ??? Float disappears or loops back
??? Start Offset: 0 cm (slider 0-5000)
    ??? Starting position on spline
```

#### Throwing Settings
```
Throwing Behavior:
??? Throw Interval: 3.0 seconds (slider 1-10)
?   ??? Time between throwing collectibles
??? Throw Force: 500 (slider 100-1000)
?   ??? How hard to throw items
??? Throw Angle: 45 degrees (slider 0-90)
?   ??? Angle of throw (45 = arc, 90 = straight up)
??? Throw Direction: Left/Right/Random (dropdown)
?   ??? Which side of float throws items
??? Collectible Types: (Array - click + to add)
    ??? [0]: BP_Collectible_Beads (70% chance)
    ??? [1]: BP_Collectible_Doubloon (15% chance)
    ??? [2]: BP_Collectible_Cup (10% chance)
    ??? [3]: BP_Collectible_KingCake (4% chance)
    ??? [4]: BP_Collectible_PowerUp (1% chance)
```

#### Collision Settings
```
Collision:
??? Collision Width: 250 cm (slider 100-500)
?   ??? How wide the collision box
??? Collision Length: 300 cm (slider 150-600)
?   ??? How long the collision box
??? Eliminate Player on Hit: Checkbox (default: True)
?   ??? Player loses if hit by float
??? Show Debug Collision: Checkbox
    ??? Visualize collision box (for testing)
```

**Creating Float Variations:**
1. Right-click `BP_ParadeFloat` in Content Browser
2. Select "Create Child Blueprint Class"
3. Name it `BP_ParadeFloat_Variant1`
4. Open and customize colors, decorations, throw behavior
5. Repeat for as many floats as you want!

**Example Float Variations:**
- `BP_ParadeFloat_KingRex` - Purple and gold, throws mostly beads
- `BP_ParadeFloat_Zulu` - Black and gold, throws coconuts
- `BP_ParadeFloat_Endymion` - Blue and silver, throws cups

---

### 3. Collectibles: Individual Blueprints

**Location:** `Content/Blueprints/Collectibles/`

#### BP_Collectible_Beads (Example)

```
Visual Settings:
??? Mesh: SM_Beads_Chain
??? Material: MI_Beads_PurpleGreenGold (Material Instance)
?   ??? Base Color: (Purple, Green, Gold stripes)
?   ??? Metallic: 0.3
?   ??? Roughness: 0.4
?   ??? Emissive: Slight glow
??? Scale: 1.0 (slider 0.5-3.0)
??? Particle Effect: PS_Sparkles (subtle)

Gameplay Settings:
??? Type: Beads (read-only - set in C++)
??? Point Value: 1 (integer)
??? Color Match Bonus: 3x (read-only - set in C++)
??? Catch Radius: 100 cm (slider 50-300)
??? Lifetime: 15 seconds (slider 5-30)
    ??? How long before disappearing

Physics Settings:
??? Mass: 0.5 kg (slider 0.1-5.0)
??? Linear Damping: 0.5 (slider 0-2)
?   ??? Air resistance
??? Angular Damping: 0.3 (slider 0-2)
?   ??? Spin resistance
??? Bounce: 0.3 (slider 0-1)
?   ??? Bounciness when hitting ground
??? Enable Gravity: Checkbox (default: True)

Audio Settings:
??? Spawn Sound: SC_Throw_Beads
??? Catch Sound: SC_Catch_Beads
??? Ground Impact Sound: SC_Impact_Soft
??? Volume: 1.0 (slider 0-1)
```

**Other Collectible Blueprints:**

| Blueprint | Visual | Point Value | Special |
|-----------|--------|-------------|---------|
| `BP_Collectible_Beads` | Purple/Green/Gold chain | 1 | Color match: 3x |
| `BP_Collectible_Doubloon` | Gold coin | 1 | Color match: 3x |
| `BP_Collectible_Cup` | Plastic cup | 1 | Color match: 3x |
| `BP_Collectible_KingCake` | Cake slice | 5 | No multipliers (flat 5 points) |
| `BP_Collectible_SpeedBoost` | Blue orb + glow | 0 | 1.5x speed for 8 seconds |
| `BP_Collectible_DoublePoints` | Gold orb + glow | 0 | 2x points for 8 seconds |

**Easy Customization:**
- Change colors: Edit Material Instance
- Change size: Adjust Scale
- Change physics: Tweak Mass, Bounce, Damping
- Change sounds: Select different Sound Cues
- **No code needed!**

---

### 4. Competitor Bots: `BP_CompetitorBot`

**Location:** `Content/Blueprints/AI/BP_CompetitorBot`

**Create 6 Bot Variants:**

#### BP_CompetitorBot_KingRex (Example)

```
Identity Settings:
??? Bot Name: "King Rex" (text field)
??? Bot Color: #FF4444 (Red) (color picker)
??? Character Mesh: SKM_Bot_King
??? Material: MI_Bot_KingRex
??? Bot Icon: T_Icon_KingRex (for leaderboard)

AI Behavior Settings:
??? Difficulty Preset: Dropdown
?   ??? Easy: 40% catch rate, slow reaction
?   ??? Medium: 70% catch rate, normal reaction
?   ??? Hard: 90% catch rate, fast reaction
??? OR customize individually:
?   ??? Reaction Time: 0.5 seconds (slider 0.1-2.0)
?   ??? Movement Speed: 500 cm/s (slider 300-800)
?   ??? Detection Radius: 800 cm (slider 500-1500)
?   ??? Catch Skill: 70% (slider 0-100)
?   ??? Claim Priority: Medium (Low/Medium/High)

Personality Traits (Affects Behavior):
??? Aggressiveness: 50 (slider 0-100)
?   ??? How likely to steal from other bots
??? Patience: 70 (slider 0-100)
?   ??? Willingness to wait for close collectibles
??? Cooperation: 30 (slider 0-100)
?   ??? Avoids collectibles other bots claimed
??? Risk-Taking: 40 (slider 0-100)
    ??? Willingness to go near obstacles/NPCs

Visual Customization:
??? Body Material: MI_Bot_Red
??? Trail Color: Red (color picker)
??? Trail Effect: PS_Trail_Default
??? Celebration Animation: Anim_Victory_Dance
??? Catch Effect: PS_Catch_Sparkle_Red

Audio:
??? Catch Sound: SC_Bot_Catch_01
??? Celebration Sound: SC_Bot_Laugh_01
??? Footstep Sound: SC_Footstep_Default
```

**Creating All 6 Bots:**

1. **King Rex** (Red) - Aggressive, fast
2. **Queen Zulu** (Green) - Balanced, cooperative
3. **Jester Jazz** (Blue) - High skill, patient
4. **Bead Baron** (Yellow) - Slow but high catch rate
5. **Doubloon Duke** (Magenta) - Risk-taker
6. **Mardi Gal** (Cyan) - Fast, low patience

**Steps:**
1. Right-click `BP_CompetitorBot` ? Duplicate
2. Rename to `BP_CompetitorBot_KingRex`
3. Open and customize settings above
4. Repeat for all 6 bots
5. **No coding required!**

---

### 5. Aggressive NPC: `BP_AggressiveNPC`

**Location:** `Content/Blueprints/AI/BP_AggressiveNPC`

```
Visual Style:
??? Mesh Type: Dropdown (Cube / Sphere / Custom)
??? Material: MI_Checker_BlackWhite
??? Glow Color (When Chasing): Red (color picker)
??? Glow Intensity: 5.0 (slider 0-10)
??? Scale: 1.0 (slider 0.5-2.0)
??? Trail Effect When Chasing: PS_Red_Trail

Behavior Settings:
??? Idle Move Speed: 200 cm/s (slider 100-500)
?   ??? Speed when not chasing
??? Chase Speed: 800 cm/s (slider 400-1200)
?   ??? Speed when chasing player
??? Chase Duration: 5 seconds (slider 3-10)
?   ??? How long to chase after hit
??? Detection Radius: 500 cm (slider 200-1000)
?   ??? How far NPC can "see" player
??? Damage to Player: 1 point (integer 1-5)
?   ??? Score penalty when NPC catches player
??? Return to Idle After Chase: Checkbox (default: True)

AI Patterns (Choose One):
??? Random Walk: Wanders randomly
??? Patrol Path: Follows a set path (assign spline)
??? Guard Point: Stays in area, chases if player enters
??? Aggressive Pursuit: Always moves toward player (hard mode)

Visual Feedback:
??? Idle Animation: Anim_Float_Idle
??? Chase Animation: Anim_Sprint
??? Hit Player Animation: Anim_Attack
??? Enable Animation: Checkbox (or just move without anim)

Audio:
??? Idle Sound: SC_NPC_Idle_Loop (low volume hum)
??? Chase Start Sound: SC_Alert_Sound
??? Chase Loop Sound: SC_Chase_Music_Loop
??? Hit Player Sound: SC_Impact_Hit
??? Audio Volume: 0.8 (slider 0-1)
```

**Difficulty Scaling by Level:**
```
Difficulty Scaling (Automated - Set and Forget):
??? Level 1: 0 NPCs
??? Level 2-3: 1 NPC
??? Level 4: 2 NPCs
??? Level 5: 2 NPCs
??? Level 6+: +1 NPC every 2 levels
    ??? (Defined in BP_ParadeGameMode)
```

---

### 6. Game Mode: `BP_ParadeGameMode`

**Location:** `Content/Blueprints/Core/BP_ParadeGameMode`

This controls **global game rules**. Very powerful for balancing!

```
Level Progression Settings:
??? Starting Level: 1 (integer)
??? Floats Per Level: 10 (integer 5-20)
?   ??? Level 1 = 10 floats, Level 2 = 20, etc.
??? Starting Target Score: 5 (integer)
??? Target Score Increment: 2 (integer 1-10)
?   ??? Level 1 = 5 points, Level 2 = 7, Level 3 = 9, etc.
??? Max Level: 99 (integer 1-999)

Difficulty Curve (Casual - Ages 10-80):
??? Float Speed Formula:
?   ??? Level 1-3: 200 cm/s (constant)
?   ??? Level 4+: 200 + ((Level - 3) * 20)
?   ??? Example: Level 5 = 240 cm/s
??? Throw Interval Formula:
?   ??? Level 1: 3.5 seconds
?   ??? Level 2: 3.2 seconds
?   ??? Level 3: 3.0 seconds
? ??? Level 4+: 3.0 - ((Level - 3) * 0.15)
???? Min: 2.0 seconds
??? NPC Count Formula:
?   ??? Level 1: 0
?   ??? Level 2-3: 1
?   ??? Level 4+: 1 + Floor((Level - 2) / 2)
??? Obstacle Count Formula:
  ??? Level 1: 1
    ??? Level 2-3: 2
    ??? Level 4+: 2 + Floor((Level - 3) / 2)

Power-Up Settings:
??? Speed Boost Duration: 8 seconds (slider 5-20)
??? Speed Boost Multiplier: 1.5x (slider 1.0-3.0)
??? Double Points Duration: 8 seconds (slider 5-20)
??? Power-Up Drop Chance: 1% (slider 0-10)
?   ??? Chance each collectible is a power-up
??? Power-Ups Can Stack: Checkbox (default: True)

Combo System:
??? Combo Window: 3.0 seconds (slider 1-10)
?   ??? Time to continue combo
??? Combo Bonus Coins: Checkbox (default: True)
?   ??? Give 1 coin per 3-combo
??? Max Combo Display: 10 (integer 5-50)
?   ??? Display "10x" max even if higher
??? Combo Break on Obstacle: Checkbox (default: True)

Color Matching:
??? Enable Color Matching: Checkbox (default: True)
??? Color Match Multiplier: 3x (slider 1-10)
?   ??? 3x points for matching player color
??? Display Color Match Effect: Checkbox (default: True)
??? Color Match Sound: SC_ColorMatch

Monetization (Optional):
??? Starting Coins: 0 (integer)
??? Coins Per Catch: 1 (integer 0-10)
??? Coins Per Combo (3+): 1 (integer 0-10)
??? Ad Reward Coins: 10 (integer 5-100)
??? Enable Ads: Checkbox (default: False for dev)
```

**How to Balance the Game:**

**Too Easy?**
- Increase float speed
- Decrease throw interval
- Add more NPCs/obstacles
- Reduce power-up drop chance

**Too Hard?**
- Decrease float speed
- Increase throw interval
- Reduce NPC count
- Increase power-up drop chance
- Increase combo window

**Just adjust sliders - no code!** ?

---

## ?? UI Widgets (UMG) - Visual Editor

### 7. Main HUD: `WBP_GameHUD`

**Location:** `Content/UI/WBP_GameHUD`

**Editing UI (No Code):**

1. Double-click `WBP_GameHUD`
2. Use **Designer** tab (visual editor)
3. Drag widgets from **Palette** panel
4. Arrange in **Hierarchy** panel
5. Customize in **Details** panel

**Widget Components:**

#### Score Display (Top Left)
```
Horizontal Box:
??? Image: Trophy icon
?   ??? Texture: T_Icon_Trophy
?   ??? Size: 32x32
?   ??? Tint: Gold
??? Text Block: Score
?   ??? Text: "0" (Binding: Get Score)
?   ??? Font: Inter Bold, Size 24
?   ??? Color: White
?   ??? Shadow: 2px black
??? Text Block: Target
    ??? Text: "/ 5" (Binding: Get Target Score)
    ??? Font: Inter Regular, Size 20
??? Color: Gray
```

**Creating Bindings (No C++ Code):**

1. Select Text Block (e.g., Score)
2. In Details panel, find "Text" property
3. Click dropdown next to "Text"
4. Select "Create Binding"
5. In Event Graph (Blueprint visual script):
   - Add node "Get Game State"
   - Add node "Cast to Parade Game State"
   - Get "Score" variable
   - Connect to "Return Value"
6. **Done! Now text auto-updates.**

#### Combo Display (Center)
```
Overlay (Center of screen):
??? Border: Background glow
?   ??? Color: Gold (animated pulse when combo active)
?   ??? Opacity: 0.8
?   ??? Blur: 5
??? Text Block: Combo Count
?   ??? Text: "5x" (Binding: Get Combo)
?   ??? Font: Inter Black, Size 48
?   ??? Color: Gold
?   ??? Animation: Scale up/down pulse
??? Text Block: Bonus Text
    ??? Text: "COLOR MATCH!" (Binding: Get Combo Text)
    ??? Font: Inter Bold, Size 24
    ??? Color: Rainbow gradient
    ??? Visibility: Hidden unless color match
```

**Adding Animations (Visual):**

1. Click "Animations" tab (bottom of UMG editor)
2. Click "+ Animation" button
3. Name it "ComboAppear"
4. Click "Track" button ? Add widgets to animate
5. Set keyframes:
   - 0.0s: Scale 0, Opacity 0
   - 0.3s: Scale 1.2, Opacity 1
 - 0.5s: Scale 1.0, Opacity 1
6. In Event Graph, call "Play Animation" when combo starts

**No code needed - all visual!** ?

---

### 8. Settings Menu: `WBP_SettingsMenu`

```
Canvas Panel:
??? Background Blur
??? Panel Title: "Settings"
??? Audio Section:
?   ??? Slider: Music Volume (0-1)
?   ?   ??? Binding: Load from Save Game
?   ??? Slider: SFX Volume (0-1)
?   ??? Checkbox: Mute All
??? Controls Section:
?   ??? Checkbox: Enable Joystick (mobile)
?   ??? Slider: Camera Sensitivity
?   ??? Button: Remap Controls (advanced)
??? Graphics Section (PC/Console):
?   ??? Dropdown: Quality (Low/Medium/High/Epic)
?   ??? Checkbox: V-Sync
?   ??? Slider: Brightness
?   ??? Checkbox: Motion Blur
??? Buttons:
    ??? Button: Save Settings
    ??? Button: Reset to Defaults
    ??? Button: Close
```

**Adding Button Functions (Visual Scripting):**

1. Select Button (e.g., "Save Settings")
2. In Details panel, scroll to "Events"
3. Click "+ On Clicked"
4. In Event Graph:
   - Add node "Create Save Game Object"
   - Add node "Set Music Volume" (from save game)
   - Add node "Save Game to Slot"
   - Add node "Print String": "Settings Saved!"
5. **Done - button works!**

---

## ?? Level Design (For Everyone!)

### Creating the Parade Street Level

**Location:** `Content/Maps/ParadeStreet_Level`

**Steps:**

1. **Open Level:** Double-click `ParadeStreet_Level`

2. **Add Ground (Street):**
   - Drag `SM_Street_Straight` into viewport
   - Duplicate (Ctrl+D) and place end-to-end
- Create long street (20 sections)

3. **Add Buildings:**
   - Drag `SM_Building_FrenchQuarter` along sides
   - Randomize slightly for variety
   - Add different building types

4. **Add Lighting:**
   - Add Directional Light (sun/moon)
   - Set to night time (dark blue)
   - Add Point Lights on lampposts
 - Add warm colors (orange, yellow)

5. **Add Crowds:**
   - Place `SM_Crowd_Person` along street edges
   - Use random variations
   - Add animations if using Skeletal Meshes

6. **Place Spawn Points:**
   - Drag `PlayerStart` into level
   - Position behind center line (z = -800)
   - Add `FloatSpawnPoint` actors at street start
   - Add `BotSpawnPoint` actors (6 locations)

7. **Create Float Path (Spline):**
   - Add `SplineComponent` to level
   - Name it "FloatPath_Main"
   - Select and edit spline points (Alt+drag to add)
   - Create straight path down street
   - Floats will follow this path

8. **Place Decorations:**
   - Add Mardi Gras decorations
   - Flags, banners, confetti
   - Make it colorful!

9. **Add Audio:**
   - Place `AmbientSound` actors
   - Set to crowd noise (looping)
   - Adjust volume falloff

10. **Test Level:**
    - Click "Play" button (Alt+P)
    - Walk around, check everything looks good
    - Adjust as needed

**No coding needed for level design!** ?

---

## ?? Audio Setup (Sound Cues)

### Creating a Sound Cue (Visual Audio Editing)

**Example: Combo Sound (Escalating)**

1. **Import Audio Files:**
   - Right-click Content Browser ? Import
   - Select WAV files:
     - `combo_2x.wav`
     - `combo_3x.wav`
     - `combo_5x.wav`

2. **Create Sound Cue:**
   - Right-click ? Sounds ? Sound Cue
   - Name it `SC_Combo`
   - Double-click to open

3. **Edit Sound Cue (Visual Node Editor):**
```
Random Node (Select one based on combo level):
??? combo_2x.wav (Weight: 1.0)
?   ??? Volume: 0.8
??? combo_3x.wav (Weight: 1.0)
?   ??? Volume: 1.0
??? combo_5x.wav (Weight: 1.0)
    ??? Volume: 1.2 (louder for big combo!)

Connect to ? Attenuation ? Output
```

4. **Set Attenuation:**
   - Inner Radius: 500 cm (full volume)
   - Outer Radius: 2000 cm (silent)
   - Falloff: Natural

5. **Save Sound Cue**

6. **Use in Blueprint:**
   - In player blueprint, when combo increases:
   - Add node "Play Sound 2D"
   - Select `SC_Combo`
   - **Done!**

**All visual - no code!** ?

---

## ?? Common Customization Tasks

### Task 1: Change Player Speed

1. Open `BP_ParadePlayer`
2. Click "Class Defaults"
3. Find "Base Move Speed"
4. Change value (e.g., 600 ? 800)
5. Compile and Save
6. Test in-game

**Time: 30 seconds** ??

### Task 2: Add New Float Type

1. Duplicate `BP_ParadeFloat`
2. Rename to `BP_ParadeFloat_MyCustomFloat`
3. Open blueprint
4. Change:
   - Mesh (different float model)
   - Material (different color)
   - Collectible types (what it throws)
   - Throw interval (how often)
5. Compile and Save
6. Place in level or add to spawn list

**Time: 5 minutes** ??

### Task 3: Make Game Easier

1. Open `BP_ParadeGameMode`
2. Adjust:
   - Increase Throw Interval (more time between throws)
   - Decrease Float Speed (slower floats)
   - Increase Combo Window (more time for combo)
   - Increase Power-Up Drop Chance
3. Compile and Save
4. Test balance

**Time: 2 minutes** ??

### Task 4: Change UI Colors

1. Open `WBP_GameHUD`
2. Select text block (e.g., Score)
3. In Details panel ? Appearance ? Color
4. Pick new color with color picker
5. Click "Compile"
6. Save

**Time: 1 minute** ??

### Task 5: Add Custom Audio

1. Import your audio file (WAV format)
2. Create Sound Cue (or use raw audio)
3. Open relevant blueprint (player, float, etc.)
4. Find audio settings in Class Defaults
5. Select your new sound from dropdown
6. Compile and Save

**Time: 3 minutes** ??

---

## ??? Tools and Shortcuts

### Essential Unreal Editor Shortcuts

| Action | Shortcut |
|--------|----------|
| Play in Editor | Alt + P |
| Stop | Esc |
| Compile Blueprint | F7 |
| Save All | Ctrl + Shift + S |
| Focus Selected | F |
| Duplicate | Ctrl + D |
| Delete | Delete |
| Undo | Ctrl + Z |
| Redo | Ctrl + Y |
| Content Browser | Ctrl + Space |
| Search All | Ctrl + F |

### Blueprint Editor Shortcuts

| Action | Shortcut |
|--------|----------|
| Compile | F7 |
| Save | Ctrl + S |
| Find | Ctrl + F |
| Add Comment | C (then drag) |
| Straighten Connections | Q |
| Break Link | Alt + Click |
| Duplicate Node | Ctrl + D |

---

## ?? Learning Resources

### For Designers (No Coding)

**Unreal Engine Official:**
- "Your First Hour in Unreal Engine 5" (YouTube)
- "Blueprint Quick Start" (docs.unrealengine.com)
- "UMG UI Designer Quick Start"

**YouTube Channels:**
- Unreal Sensei (Blueprint tutorials)
- Matt Aspland (UE5 for beginners)
- Ryan Laley (Game design in UE5)

### For Artists

**3D Modeling:**
- Blender Guru (YouTube) - Blender tutorials
- Grant Abbitt (YouTube) - Game asset creation

**Texturing:**
- Stylized Station (YouTube) - Stylized materials
- Josh Gambrell (YouTube) - Substance Painter

### For Technical Designers

**Blueprint Advanced:**
- Mathew Wadstein (YouTube) - Blueprint API
- Ryan Manning (YouTube) - Blueprint optimization

**C++ (if interested):**
- Tom Looman's UE C++ Guide (tomlooman.com)
- Unreal Engine C++ Documentation

---

## ? FAQ

### Q: Do I need to know C++ to use Unreal?
**A:** No! Blueprints handle 99% of what designers need. C++ is for programmers to create the foundation.

### Q: What if I break something?
**A:** Unreal has unlimited undo (Ctrl+Z). Worst case, revert to last Git commit.

### Q: Can I change C++ properties without coding?
**A:** Yes! If marked `UPROPERTY(EditAnywhere, BlueprintReadWrite)`, you can edit in Blueprint Class Defaults.

### Q: How do I make a variable editable in Blueprint?
**A:** Programmers add `UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")` in C++. Then you can edit it!

### Q: What if a value doesn't have a slider?
**A:** Ask a programmer to add `meta = (UIMin = "0", UIMax = "1000")` to the UPROPERTY. Then it becomes a slider!

### Q: Can I create new features without coding?
**A:** Yes, using Blueprint visual scripting! You can create complex logic by connecting nodes.

### Q: Where do I find help?
**A:** 
- Unreal Forums (forums.unrealengine.com)
- Unreal Slackers Discord
- This project's GitHub issues
- Ask your team's programmer!

---

## ? Summary

### What You CAN Do (No Coding):

? Adjust all gameplay values (speed, damage, timing, etc.)  
? Create new Blueprint variants (floats, collectibles, bots)  
? Design levels (place objects, lighting, etc.)  
? Edit UI (move elements, change colors, resize)  
? Create animations (timeline-based, keyframe)  
? Set up audio (sound cues, volumes, triggers)  
? Balance game difficulty (adjust formulas with sliders)  
? Create visual effects (particle systems)  
? Change materials and textures  
? Configure AI behavior (using presets or sliders)  

### What You NEED Coding For:

? Adding new game mechanics (new systems)  
? Changing core architecture  
? Complex math/algorithms  
? Custom shaders (HLSL)  
? Networking/multiplayer  
? Plugin development  
? Advanced optimization  

**But 90% of game customization is possible with just Blueprints!** ??

---

**Document Version:** 1.0  
**Target Audience:** Non-Technical Designers  
**Last Updated:** {{ Current Date }}

Happy designing! ????

