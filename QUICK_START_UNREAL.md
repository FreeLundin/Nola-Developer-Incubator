# Quick Start Guide - Unreal Engine Conversion

## ?? Getting Started in 5 Steps

### Step 1: Install Prerequisites (30 minutes)

**Required Software:**

1. **Unreal Engine 5.4** (or latest)
   - Download: [Unreal Engine Launcher](https://www.unrealengine.com/download)
 - Install size: ~40 GB
   - Also installs: Visual Studio 2022 Community (if not present)

2. **Visual Studio 2022 Community** (if not auto-installed)
   - Download: [Visual Studio](https://visualstudio.microsoft.com/downloads/)
   - Required Workloads:
  - ? Game development with C++
     - ? .NET desktop development
   - Install size: ~8 GB

3. **Git Large File Storage (LFS)**
   ```bash
   # Download from: https://git-lfs.github.com/
   git lfs install
   ```

4. **Node.js 18+** (you already have this for the web version)
   - Verify: `node --version`

**Optional but Recommended:**

5. **Blender** (for 3D modeling)
   - Download: [Blender.org](https://www.blender.org/download/)
   - Free and open source

6. **Substance Painter** (for texturing)
   - Download: [Adobe Substance](https://www.adobe.com/products/substance3d-painter.html)
   - 30-day trial available

---

### Step 2: Create Unreal Project (15 minutes)

**Option A: Create Fresh Project**

1. **Open Epic Games Launcher**
2. **Go to Unreal Engine tab**
3. **Click "Launch" on UE 5.4**
4. **Select "Games" ? "Third Person"**
5. **Configure:**
   ```
   Project Settings:
   ??? Blueprint or C++: C++
   ??? Target Platform: Desktop & Mobile
   ??? Quality Preset: Scalable
   ??? Starter Content: No
   ??? Raytracing: Disabled (enable later if needed)
   
   Project Location:
   ??? C:\Users\BLund\source\repos\FreeLundin\Mardi-Gras-Parade-Game\unreal
   
   Project Name:
   ??? MardiGrasParade
   ```
6. **Click "Create"**
7. **Wait for project to open** (5-10 minutes first time)

**Option B: Use Provided Template (Coming Soon)**

If your team creates a starter template:
```bash
cd C:\Users\BLund\source\repos\FreeLundin\Mardi-Gras-Parade-Game\unreal
git clone [template-repo-url] MardiGrasParade
cd MardiGrasParade
# Right-click MardiGrasParade.uproject ? Generate Visual Studio project files
# Open MardiGrasParade.sln in Visual Studio ? Build Solution (F7)
# Open MardiGrasParade.uproject
```

---

### Step 3: Configure Project Structure (10 minutes)

**Create Folder Structure in Content Browser:**

```
Content/
??? Blueprints/
?   ??? Characters/
?   ??? Floats/
?   ??? Collectibles/
?   ??? AI/
? ??? Core/
??? Materials/
?   ??? Characters/
?   ??? Environment/
?   ??? Collectibles/
?   ??? Effects/
??? Meshes/
?   ??? Characters/
?   ??? Floats/
?   ??? Collectibles/
?   ??? Environment/
? ??? Props/
??? Textures/
?   ??? Characters/
?   ??? Environment/
?   ??? UI/
??? Animations/
?   ??? Player/
?   ??? Bots/
?   ??? NPCs/
??? Audio/
?   ??? Music/
?   ??? SFX/
???? Ambient/
??? UI/
?   ??? HUD/
?   ??? Menus/
?   ??? Icons/
??? Maps/
?   ??? ParadeStreet_Level (main level)
?   ??? TestLevel_Collectibles
?   ??? TestLevel_AI
??? Data/
    ??? DataTables/
    ??? Curves/
```

**How to Create Folders:**
1. Right-click in Content Browser
2. Select "New Folder"
3. Name according to structure above
4. Repeat for all folders

---

### Step 4: Set Up Version Control (15 minutes)

**Configure Git for Unreal:**

1. **Navigate to project root:**
   ```bash
   cd C:\Users\BLund\source\repos\FreeLundin\Mardi-Gras-Parade-Game
   ```

2. **Create/Update .gitignore:**
   ```bash
   # Create .gitignore file if it doesn't exist
   New-Item -ItemType File -Path .gitignore -Force
   
   # Add Unreal-specific ignores
   Add-Content .gitignore @"
   
   # Unreal Engine
unreal/MardiGrasParade/Binaries/
   unreal/MardiGrasParade/Intermediate/
   unreal/MardiGrasParade/Saved/
   unreal/MardiGrasParade/DerivedDataCache/
   unreal/MardiGrasParade/.vs/
   unreal/MardiGrasParade/.vscode/
   *.sln
   *.suo
   *.opensdf
   *.sdf
   *.VC.db
   *.VC.opendb
   
   # Source control
   *.pdb
   *.iobj
   *.ipdb
   *.exp
   
   # Build results
   [Bb]uild/
   [Bb]uilds/
   "@
   ```

3. **Set up Git LFS:**
   ```bash
   git lfs install
   
   # Create .gitattributes
   New-Item -ItemType File -Path .gitattributes -Force
   
   Add-Content .gitattributes @"
   # Unreal Engine LFS
   *.uasset filter=lfs diff=lfs merge=lfs -text
   *.umap filter=lfs diff=lfs merge=lfs -text
   *.upk filter=lfs diff=lfs merge=lfs -text
   *.udk filter=lfs diff=lfs merge=lfs -text
   
   # 3D Models
   *.fbx filter=lfs diff=lfs merge=lfs -text
   *.obj filter=lfs diff=lfs merge=lfs -text
   *.blend filter=lfs diff=lfs merge=lfs -text
   
   # Textures
   *.png filter=lfs diff=lfs merge=lfs -text
   *.tga filter=lfs diff=lfs merge=lfs -text
   *.exr filter=lfs diff=lfs merge=lfs -text
   *.hdr filter=lfs diff=lfs merge=lfs -text
   *.psd filter=lfs diff=lfs merge=lfs -text
   
   # Audio
   *.wav filter=lfs diff=lfs merge=lfs -text
   *.mp3 filter=lfs diff=lfs merge=lfs -text
   *.ogg filter=lfs diff=lfs merge=lfs -text
   
   # Video
   *.mp4 filter=lfs diff=lfs merge=lfs -text
   *.mov filter=lfs diff=lfs merge=lfs -text
   "@
   ```

4. **Initial Commit:**
   ```bash
   git add .
   git commit -m "feat: initial Unreal Engine project setup"
   git push origin main
   ```

---

### Step 5: Verify Setup (5 minutes)

**Checklist:**

- [ ] Unreal Editor opens without errors
- [ ] Can compile C++ code (Build ? Compile - F7)
- [ ] Can press Play (Alt+P) and move default character
- [ ] Content Browser shows folder structure
- [ ] Git tracking Unreal files correctly
- [ ] Backend server still works: `npm run dev` in root directory

**Test Compilation:**
1. In Unreal Editor: **File ? Refresh Visual Studio Project**
2. Close Unreal Editor
3. Open `MardiGrasParade.sln` in Visual Studio
4. Press **F7** to build
5. Should build successfully (may take 5-10 minutes first time)
6. Close Visual Studio
7. Open `MardiGrasParade.uproject` again

? **If all checks pass, you're ready to start development!**

---

## ?? Phase 1 Development Checklist

### Week 1: Core C++ Classes

#### Day 1-2: Player Character

**File:** `Source/MardiGrasParade/Characters/ParadePlayerCharacter.h/.cpp`

```cpp
// ParadePlayerCharacter.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "InputActionValue.h"
#include "ParadePlayerCharacter.generated.h"

UENUM(BlueprintType)
enum class ECollectibleColor : uint8
{
Beads UMETA(DisplayName = "Beads (Purple/Green/Gold)"),
    Doubloon UMETA(DisplayName = "Doubloon (Gold Coin)"),
    Cup UMETA(DisplayName = "Cup (Plastic)")
};

UCLASS()
class MARDIGRASPARADE_API AParadePlayerCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    AParadePlayerCharacter();

    // Movement
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Config", meta = (UIMin = "0", UIMax = "1000"))
    float BaseMoveSpeed = 600.0f;
 
 UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Config", meta = (UIMin = "1.0", UIMax = "3.0"))
    float SpeedBoostMultiplier = 1.5f;
    
    // Game State
    UPROPERTY(BlueprintReadWrite, Category = "Game|Stats")
    int32 Score = 0;
    
    UPROPERTY(BlueprintReadWrite, Category = "Game|Stats")
    int32 Combo = 0;
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Color")
    ECollectibleColor PlayerColor;
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Config", meta = (UIMin = "50", UIMax = "500"))
    float CatchRadius = 150.0f;
    
    // Input Actions (Enhanced Input)
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Input", meta = (AllowPrivateAccess = "true"))
    class UInputMappingContext* DefaultMappingContext;
    
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Input", meta = (AllowPrivateAccess = "true"))
    class UInputAction* MoveAction;
    
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Input", meta = (AllowPrivateAccess = "true"))
    class UInputAction* ClickMoveAction;
 
    // Functions
UFUNCTION(BlueprintCallable, Category = "Game")
    void CatchCollectible(class ACollectible* Collectible);
    
    UFUNCTION(BlueprintCallable, Category = "Movement")
    void SetMoveTarget(FVector TargetLocation);
    
    UFUNCTION(BlueprintCallable, Category = "PowerUps")
    void ActivateSpeedBoost(float Duration);

protected:
    virtual void BeginPlay() override;
    virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

public:
    virtual void Tick(float DeltaTime) override;

private:
    void Move(const FInputActionValue& Value);
    void ClickToMove(const FInputActionValue& Value);
    void MoveToTarget(float DeltaTime);
    
    FVector MouseTargetLocation = FVector::ZeroVector;
    bool bHasMouseTarget = false;
  bool bSpeedBoostActive = false;
    FTimerHandle SpeedBoostTimerHandle;
    
    void OnSpeedBoostEnd();
};
```

**Tasks:**
- [ ] Create header file (.h)
- [ ] Create implementation file (.cpp)
- [ ] Set up Enhanced Input (IMC, IA)
- [ ] Implement movement logic
- [ ] Test in editor

**Estimated Time:** 6-8 hours

---

#### Day 3-4: Game Mode & Game State

**Files:**
- `Source/MardiGrasParade/GameModes/ParadeGameMode.h/.cpp`
- `Source/MardiGrasParade/GameModes/ParadeGameState.h/.cpp`

**Key Features:**
- Level progression system
- Score tracking
- Float management
- Difficulty scaling formulas

**Tasks:**
- [ ] Create GameMode class
- [ ] Create GameState class
- [ ] Implement level progression
- [ ] Add difficulty curves
- [ ] Test level transitions

**Estimated Time:** 8-10 hours

---

#### Day 5: Collectible System

**File:** `Source/MardiGrasParade/Collectibles/Collectible.h/.cpp`

**Key Features:**
- Physics-based throwing
- Collision detection
- Type system (beads, doubloon, cup, etc.)
- Catch mechanics

**Tasks:**
- [ ] Create base Collectible class
- [ ] Add ProjectileMovementComponent
- [ ] Implement collision logic
- [ ] Add sound/VFX hooks
- [ ] Test throwing physics

**Estimated Time:** 6-8 hours

---

### Week 2: Blueprint Setup

#### Day 1: Player Blueprint

**File:** `Content/Blueprints/Characters/BP_ParadePlayer`

**Tasks:**
- [ ] Create Blueprint from C++ class
- [ ] Add/configure Skeletal Mesh
- [ ] Set up Camera and Spring Arm
- [ ] Configure default values (speed, catch radius, etc.)
- [ ] Add placeholder animations
- [ ] Test movement in level

**Estimated Time:** 4-6 hours

---

#### Day 2-3: Parade Float Blueprints

**File:** `Content/Blueprints/Floats/BP_ParadeFloat`

**Tasks:**
- [ ] Create C++ base class (AParadeFloat)
- [ ] Create Blueprint from C++ class
- [ ] Add Static Mesh component
- [ ] Set up spline following logic
- [ ] Implement throwing system
- [ ] Create 3+ float variants
- [ ] Test in level

**Estimated Time:** 8-10 hours

---

#### Day 4-5: Collectible Blueprints

**Files:**
- `Content/Blueprints/Collectibles/BP_Collectible_Beads`
- `Content/Blueprints/Collectibles/BP_Collectible_Doubloon`
- `Content/Blueprints/Collectibles/BP_Collectible_Cup`
- (and more)

**Tasks:**
- [ ] Create Blueprint for each type (6 total)
- [ ] Configure meshes, materials, colors
- [ ] Set physics properties (mass, bounce, etc.)
- [ ] Add particle effects
- [ ] Add sounds
- [ ] Test each type

**Estimated Time:** 6-8 hours

---

## ?? Testing Workflow

### Daily Testing Routine

**Every Time You Make Changes:**

1. **Compile Code (C++):**
   - Unreal Editor: **Ctrl+Alt+F11** (Hot Reload)
   - Or close Unreal, build in Visual Studio (F7), reopen

2. **Compile Blueprints:**
 - Open Blueprint
   - Click **Compile** button (top toolbar)
   - Fix any errors shown

3. **Play in Editor:**
   - Press **Alt+P** (or Play button)
   - Test your changes
   - Press **Esc** to stop

4. **Check Output Log:**
   - **Window ? Developer Tools ? Output Log**
   - Look for errors, warnings, or your debug prints

5. **Save Everything:**
   - **Ctrl+Shift+S** (Save All)

---

### Weekly Testing Checklist

**Every Friday:**

- [ ] All C++ code compiles without errors
- [ ] All Blueprints compile without errors
- [ ] Can play through one full level
- [ ] Core mechanics working (movement, catching, scoring)
- [ ] No major visual glitches
- [ ] Backend API connection works (if implemented)
- [ ] Git commit with working state

---

## ?? Common Setup Issues & Solutions

### Issue 1: "Unreal Editor won't open"

**Solutions:**
1. Right-click `.uproject` ? **Switch Unreal Engine version**
2. Right-click `.uproject` ? **Generate Visual Studio project files**
3. Open `.sln` in Visual Studio ? **Build Solution** (F7)
4. Try opening `.uproject` again

### Issue 2: "C++ code won't compile"

**Solutions:**
1. Close Unreal Editor completely
2. Delete these folders in project:
   - `Binaries/`
   - `Intermediate/`
   - `Saved/`
3. Right-click `.uproject` ? Generate VS project files
4. Open `.sln` in Visual Studio
5. Build Solution (F7)
6. Open `.uproject`

### Issue 3: "Hot Reload not working"

**Solution:**
- Don't use Hot Reload for major changes
- Close Unreal Editor, compile in VS, reopen
- Hot Reload only for minor tweaks

### Issue 4: "Git LFS not working"

**Solutions:**
```bash
# Reinstall Git LFS
git lfs install

# Track Unreal files
git lfs track "*.uasset"
git lfs track "*.umap"
git lfs track "*.fbx"

# Verify tracking
git lfs ls-files
```

### Issue 5: "Performance is slow in editor"

**Solutions:**
1. **Editor Preferences ? Performance:**
   - Use Less CPU when in Background: ?
   - Frame Rate Limit: 60 FPS
   
2. **Project Settings ? Rendering:**
   - Forward Shading: Enabled
   - Mobile HDR: Enabled (for mobile dev)
   
3. **Scalability Settings (toolbar):**
   - Set to "Medium" during development
   - Set to "Epic" for final testing

---

## ?? Getting Help

### Documentation
- **Unreal Engine Docs:** [docs.unrealengine.com](https://docs.unrealengine.com)
- **C++ API Reference:** [docs.unrealengine.com/cpp](https://docs.unrealengine.com/cpp)
- **Blueprint API Reference:** [docs.unrealengine.com/blueprintapi](https://docs.unrealengine.com/blueprintapi)

### Community
- **Unreal Forums:** [forums.unrealengine.com](https://forums.unrealengine.com)
- **Unreal Slackers Discord:** [unrealslackers.org](https://unrealslackers.org)
- **Reddit:** [r/unrealengine](https://reddit.com/r/unrealengine)

### Learning
- **Unreal Learning Portal:** [learn.unrealengine.com](https://learn.unrealengine.com)
- **YouTube:** Search "Unreal Engine 5 [your topic]"
- **Udemy:** "Unreal Engine 5 C++ Developer" course

---

## ? Ready to Start!

You've completed the setup! Here's what to do next:

1. **Review the conversion plan:** `UNREAL_CONVERSION_PLAN.md`
2. **Start with Week 1, Day 1:** Create player character C++ class
3. **Follow the blueprint guide:** `UNREAL_BLUEPRINT_GUIDE.md` for customization
4. **Reference running guide:** `RUNNING_BOTH_VERSIONS.md` for backend integration
5. **Commit frequently:** Small commits make it easier to roll back if needed

---

## ?? Next Steps (After Setup)

1. **Create Player Character C++ class** (see Day 1-2 checklist above)
2. **Create Player Blueprint** (see Week 2, Day 1)
3. **Test movement in empty level**
4. **Create Game Mode classes** (see Day 3-4)
5. **Continue following Week 1-2 checklist**

---

**Need Help?**
- Check troubleshooting section above
- Ask in team chat
- Create GitHub issue with [unreal] tag
- Reference official Unreal docs

**Happy developing!** ????

---

**Document Version:** 1.0
**Last Updated:** {{ Current Date }}  
**Estimated Total Setup Time:** 1.5 hours  
**Next Document:** `UNREAL_CONVERSION_PLAN.md` ? Phase 1
