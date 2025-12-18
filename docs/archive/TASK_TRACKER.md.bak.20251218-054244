# Jira Integration for Unreal Engine

## Option 1: Jira Plugin for Unreal

### Installation

1. **Download Jira Plugin:**
   - Unreal Marketplace: Search "Jira"
   - Or GitHub: [UnrealJira Plugin](https://github.com/Allar/JiraIntegration)

2. **Install to Project:**
   ```
   unreal/MardiGrasParade/Plugins/JiraIntegration/
   ```

3. **Enable in Unreal:**
   ```
   Edit ? Plugins ? Search "Jira" ? Enable
   Restart Unreal Editor
   ```

4. **Configure:**
   ```
   Edit ? Project Settings ? Jira Integration
   ??? Jira URL: https://your-domain.atlassian.net
   ??? Email: your-email@example.com
   ??? API Token: [Generate from Jira]
   ??? Project Key: MARDI (or your project key)
   ```

### Usage in Unreal

**In Blueprint Editor:**
```
Right-click node ? Create Jira Issue
??? Type: Bug / Task / Story
??? Summary: "Fix float collision detection"
??? Description: Auto-filled with Blueprint context
??? Priority: High / Medium / Low
??? Assignee: Select team member
```

**In C++ Editor (Visual Studio):**
```cpp
// TODO: MARDI-123 - Implement collectible spawning logic
// FIXME: MARDI-124 - Performance issue in catch detection
// NOTE: MARDI-125 - Test on iPhone 11
```

**From Error Log:**
```
Output Log ? Right-click error ? Create Jira Issue
Auto-creates issue with:
??? Error message
??? Stack trace
??? Blueprint/code location
??? Engine version
```

### Features

? **Create issues from editor**
? **Link issues to assets**
? **Track work time**
? **Update status from Unreal**
? **View assigned tasks in-editor**
? **Attach screenshots automatically**

---

## Option 2: Jira REST API Integration

For custom integration, create a Blueprint/C++ system:

### C++ Implementation

```cpp
// JiraAPIClient.h
#pragma once

#include "CoreMinimal.h"
#include "Http.h"
#include "Json.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "JiraAPIClient.generated.h"

UCLASS()
class UJiraAPIClient : public UGameInstanceSubsystem
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Jira")
    FString JiraURL = "https://your-domain.atlassian.net";
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Jira")
    FString ProjectKey = "MARDI";
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Jira")
    FString APIToken = "";

    UFUNCTION(BlueprintCallable, Category = "Jira")
    void CreateIssue(FString Summary, FString Description, FString IssueType);
    
    UFUNCTION(BlueprintCallable, Category = "Jira")
    void GetMyTasks();
    
    UFUNCTION(BlueprintCallable, Category = "Jira")
    void UpdateIssueStatus(FString IssueKey, FString NewStatus);

private:
    void OnCreateIssueResponse(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bSuccess);
};
```

### Blueprint Usage

```
Event Graph:
??? Event: On Compilation Error
?   ??? Get Jira Client
?   ??? Create Issue
?   ?   ??? Summary: "Compilation Error in BP_ParadePlayer"
?   ?   ??? Description: Error message + stack trace
?   ?   ??? Type: "Bug"
?   ??? Print String: "Jira issue created!"
```

---

## Option 3: GitHub Issues Integration

Using GitHub as task tracker:

### GitHub Plugin for Unreal

```
1. Download: GitHub Integration Plugin (Marketplace or custom)
2. Install to: unreal/MardiGrasParade/Plugins/
3. Configure:
 Edit ? Project Settings ? GitHub
   ??? Repository: FreeLundin/Nola-Developer-Incubator
   ??? Token: [Personal Access Token]
   ??? Default Labels: unreal, bug, task
```

### Create Issues from Unreal

**Blueprint Editor:**
```
Right-click ? GitHub ? Create Issue
??? Title: "Implement parade float spawning"
??? Labels: unreal, feature, parade-floats
??? Milestone: Phase 2 - Core Gameplay
??? Assignees: @your-username
```

**C++ Comments:**
```cpp
// TODO: [GH-123] Implement color matching bonus
// FIXME: [GH-124] Float speed calculation incorrect
// OPTIMIZE: [GH-125] Reduce draw calls in ParadeFloat
```

### View Tasks in Editor

Custom widget showing GitHub issues:

```
Window ? Developer Tools ? GitHub Tasks
??? My Issues
??? In Progress
??? Review Needed
??? Completed
```

---

## Recommended Setup for Your Project

Based on your Mardi Gras Parade project, here's my recommendation:

### **Primary: GitHub Projects + Issues**

**Why:**
- ? You're already using GitHub
- ? Free for public repos
- ? Integrated with your repository
- ? Easy team collaboration
- ? Can reference in commits

**Setup Steps:**

1. **Enable GitHub Projects:**
   ```
   Repository ? Projects ? New Project
   Name: "Mardi Gras Parade - Unreal Development"
   Template: Team backlog
 ```

2. **Create Project Board:**
   ```
   Columns:
   ??? ?? Backlog
   ??? ?? To Do (This Week)
   ??? ?? In Progress
   ??? ?? Review
   ??? ? Done
   ??? ?? Deployed
   ```

3. **Add Issues from Roadmap:**
   ```
   Phase 1 - Foundation:
   - [ ] #1 Create BP_ParadePlayer Blueprint
   - [ ] #2 Design ParadeStreet_Level
   - [ ] #3 Setup Enhanced Input
   - [ ] #4 Test player movement
   
   Phase 2 - Core Gameplay:
   - [ ] #5 Create AParadeFloat C++ class
   - [ ] #6 Create ACollectible C++ class
   - [ ] #7 Implement catching mechanics
   ```

4. **Link in Commits:**
   ```bash
   git commit -m "[unreal] feat: implemented player movement
   
   Closes #1
   Related to #3"
   ```

### **Secondary: Built-in TODO Comments**

In your C++ code:

```cpp
// ParadePlayerCharacter.cpp

// TODO: PHASE1-001 - Add joystick support for mobile
void AParadePlayerCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    // Implementation
}

// FIXME: PHASE2-015 - Optimize catch radius calculation
void AParadePlayerCharacter::CatchCollectible(ACollectible* Collectible)
{
  // Implementation
}

// OPTIMIZE: PHASE3-042 - Reduce combo calculation overhead
void AParadePlayerCharacter::UpdateCombo()
{
    // Implementation
}

// NOTE: PHASE4-089 - Test on all target platforms
void AParadePlayerCharacter::ActivateSpeedBoost(float Duration)
{
    // Implementation
}
```

### **Tertiary: Visual Studio Task List**

View TODOs in Visual Studio:

```
View ? Task List
Filter: Comments

Shows all TODO, FIXME, OPTIMIZE, NOTE comments
Click to jump to code location
```

---

## ??? Create Custom Task Management for Your Project

Let me create a simple task tracking system integrated with your docs:

<function_calls>
<invoke name="create_file">
<parameter name="content"># Mardi Gras Parade - Unreal Development Task Tracker

## ?? Active Sprint (Week 1-2: Foundation)

### Status Legend
- ? Not Started
- ?? In Progress
- ?? Review
- ? Complete
- ?? Blocked

---

## Phase 1: Foundation (Weeks 1-2)

### Week 1: Project Setup & Player

| ID | Task | Status | Assignee | Priority | Notes |
|----|------|--------|----------|----------|-------|
| F1-001 | Generate VS project files | ? | You | P0 | See START_HERE.md Step 1 |
| F1-002 | Build in Visual Studio | ? | You | P0 | See START_HERE.md Step 2 |
| F1-003 | Open in Unreal Editor | ? | You | P0 | See START_HERE.md Step 3 |
| F1-004 | Create BP_ParadePlayer | ? | You | P0 | See START_HERE.md Step 4 |
| F1-005 | Add MetaHuman mesh (optional) | ? | Designer | P2 | See custom mesh guide |
| F1-006 | Configure player settings | ? | Designer | P1 | Movement speed, catch radius |
| F1-007 | Test WASD movement | ? | You | P0 | See START_HERE.md Step 5 |
| F1-008 | Test click-to-move | ? | You | P1 | Should work automatically |
| F1-009 | Adjust camera settings | ? | Designer | P2 | Distance, FOV, offset |

### Week 2: Game Mode & Level

| ID | Task | Status | Assignee | Priority | Notes |
|----|------|--------|----------|----------|-------|
| F2-001 | Complete ParadeGameMode.cpp | ? | Developer | P0 | Implement C++ methods |
| F2-002 | Create BP_ParadeGameMode | ? | You | P0 | Blueprint from C++ class |
| F2-003 | Set as default game mode | ? | You | P0 | Edit ? Project Settings |
| F2-004 | Create ParadeStreet_Level | ? | Designer | P0 | New level with street |
| F2-005 | Add ground/street mesh | ? | Designer | P1 | Flat or detailed street |
| F2-006 | Add buildings | ? | Designer | P2 | French Quarter style |
| F2-007 | Setup lighting (night) | ? | Designer | P1 | Dark blue sky, street lights |
| F2-008 | Add ambient crowd | ? | Designer | P3 | Static meshes or animated |
| F2-009 | Create float path spline | ? | Designer | P1 | Path for floats to follow |
| F2-010 | Setup Enhanced Input | ? | Developer | P0 | IMC and Input Actions |
| F2-011 | Test full movement | ? | You | P0 | All input methods working |

---

## Phase 2: Core Gameplay (Weeks 3-4)

### Week 3: Floats & Collectibles

| ID | Task | Status | Assignee | Priority | Notes |
|----|------|--------|----------|----------|-------|
| C1-001 | Create AParadeFloat.h | ? | Developer | P0 | C++ header file |
| C1-002 | Create AParadeFloat.cpp | ? | Developer | P0 | C++ implementation |
| C1-003 | Create BP_ParadeFloat | ? | You | P0 | Blueprint from C++ |
| C1-004 | Add custom float mesh | ? | Designer | P1 | Or use placeholder |
| C1-005 | Configure float settings | ? | Designer | P1 | Speed, throw interval, etc. |
| C1-006 | Test float movement | ? | You | P0 | Along spline |
| C1-007 | Create ACollectible.h | ? | Developer | P0 | C++ header file |
| C1-008 | Create ACollectible.cpp | ? | Developer | P0 | C++ implementation |
| C1-009 | Create BP_Collectible_Beads | ? | You | P0 | First collectible type |
| C1-010 | Create BP_Collectible_Doubloon | ? | You | P1 | Second type |
| C1-011 | Create BP_Collectible_Cup | ? | You | P1 | Third type |
| C1-012 | Add collectible meshes | ? | Designer | P1 | Custom or placeholder |
| C1-013 | Configure physics | ? | You | P1 | Mass, bounce, drag |

### Week 4: Catching & Scoring

| ID | Task | Status | Assignee | Priority | Notes |
|----|------|--------|----------|----------|-------|
| C2-001 | Implement throw logic | ? | Developer | P0 | Float throws collectibles |
| C2-002 | Implement catch detection | ? | Developer | P0 | Player catches items |
| C2-003 | Add score display | ? | Designer | P0 | UMG widget |
| C2-004 | Add combo display | ? | Designer | P1 | UMG widget |
| C2-005 | Test catching mechanics | ? | You | P0 | Various distances |
| C2-006 | Add catch sound effects | ? | Designer | P2 | Audio feedback |
| C2-007 | Add catch visual effects | ? | Designer | P2 | Particle effects |
| C2-008 | Test color matching | ? | You | P1 | 3x bonus working |
| C2-009 | Balance catch difficulty | ? | Designer | P1 | Adjust catch radius |

---

## Phase 3: AI & Competition (Weeks 5-6)

### Week 5: Competitor Bots

| ID | Task | Status | Assignee | Priority | Notes |
|----|------|--------|----------|----------|-------|
| A1-001 | Create ACompetitorBot.h | ? | Developer | P0 | C++ header |
| A1-002 | Create ACompetitorBot.cpp | ? | Developer | P0 | C++ implementation |
| A1-003 | Create AI Controller | ? | Developer | P0 | AIController class |
| A1-004 | Create Behavior Tree | ? | Designer | P1 | BT_CompetitorBot |
| A1-005 | Create Blackboard | ? | Designer | P1 | BB_CompetitorBot |
| A1-006 | Create BP_CompetitorBot_KingRex | ? | You | P0 | First bot |
| A1-007 | Create BP_CompetitorBot_QueenZulu | ? | You | P1 | Second bot |
| A1-008 | Create remaining 4 bots | ? | You | P2 | Complete set of 6 |
| A1-009 | Add bot meshes/MetaHumans | ? | Designer | P2 | Visual appearance |
| A1-010 | Configure bot personalities | ? | Designer | P1 | Speed, skill, etc. |
| A1-011 | Test bot AI behavior | ? | You | P0 | Catching collectibles |
| A1-012 | Balance bot difficulty | ? | Designer | P1 | Not too easy/hard |

### Week 6: Aggressive NPCs

| ID | Task | Status | Assignee | Priority | Notes |
|----|------|--------|----------|----------|-------|
| A2-001 | Create AAggressiveNPC.h | ? | Developer | P0 | C++ header |
| A2-002 | Create AAggressiveNPC.cpp | ? | Developer | P0 | C++ implementation |
| A2-003 | Create BP_AggressiveNPC | ? | You | P0 | Blueprint class |
| A2-004 | Implement chase behavior | ? | Developer | P0 | Chase player when hit |
| A2-005 | Add NPC visual (cube/sphere) | ? | Designer | P1 | Black & white checker |
| A2-006 | Test NPC spawning by level | ? | You | P1 | Correct count per level |
| A2-007 | Test chase mechanics | ? | You | P0 | 5 second chase |
| A2-008 | Add chase visual effects | ? | Designer | P2 | Red glow, trail |
| A2-009 | Balance NPC difficulty | ? | Designer | P1 | Casual curve |

---

## Phase 4: UI & UX (Weeks 7-8)

### Week 7: HUD & Menus

| ID | Task | Status | Assignee | Priority | Notes |
|----|------|--------|----------|----------|-------|
| U1-001 | Create WBP_GameHUD | ? | Designer | P0 | Main game HUD |
| U1-002 | Create WBP_TutorialScreen | ? | Designer | P1 | Instructions |
| U1-003 | Create WBP_WinScreen | ? | Designer | P0 | End game results |
| U1-004 | Create WBP_SettingsMenu | ? | Designer | P1 | Audio, controls, etc. |
| U1-005 | Create WBP_CosmeticShop | ? | Designer | P2 | Skin purchasing |
| U1-006 | Bind HUD to game state | ? | Developer | P0 | Show live data |
| U1-007 | Test all UI screens | ? | You | P0 | Navigation working |
| U1-008 | Polish UI visuals | ? | Designer | P2 | Colors, fonts, layout |

### Week 8: Touch Controls

| ID | Task | Status | Assignee | Priority | Notes |
|----|------|--------|----------|----------|-------|
| U2-001 | Create WBP_VirtualJoystick | ? | Designer | P0 | Mobile controls |
| U2-002 | Implement joystick input | ? | Developer | P0 | Send to player |
| U2-003 | Test on mobile device | ? | You | P1 | Android/iOS |
| U2-004 | Create WBP_TouchButtons | ? | Designer | P2 | Additional buttons |
| U2-005 | Add joystick toggle setting | ? | Developer | P1 | Enable/disable |
| U2-006 | Test UI scaling | ? | You | P1 | Different screen sizes |

---

## Quick Task Commands

### Add New Task
```bash
# Add to this file in appropriate phase/week
# Use next sequential ID
# Set appropriate priority (P0=Critical, P1=High, P2=Medium, P3=Low)
```

### Update Task Status
```bash
# Change status emoji:
# ? Not Started
# ?? In Progress
# ?? Review
# ? Complete
# ?? Blocked
```

### Link to GitHub Issue
```bash
# Create GitHub issue for task
# Add issue number to Notes column
# Example: "See GitHub issue #123"
```

### Track Time
```bash
# Add time estimate to Notes
# Example: "Est: 2 hours"
# Track actual: "Actual: 3 hours"
```

---

## ?? Progress Dashboard

### Phase 1: Foundation
- **Total Tasks:** 20
- **Completed:** 0
- **In Progress:** 0
- **Blocked:** 0
- **Progress:** 0% ??????????

### Phase 2: Core Gameplay
- **Total Tasks:** 22
- **Completed:** 0
- **In Progress:** 0
- **Blocked:** 0
- **Progress:** 0% ??????????

### Phase 3: AI & Competition
- **Total Tasks:** 21
- **Completed:** 0
- **In Progress:** 0
- **Blocked:** 0
- **Progress:** 0% ??????????

### Phase 4: UI & UX
- **Total Tasks:** 14
- **Completed:** 0
- **In Progress:** 0
- **Blocked:** 0
- **Progress:** 0% ??????????

---

## ?? This Week's Focus

**Current Sprint:** Phase 1, Week 1
**Sprint Goal:** Get Unreal project building and player moving

**Priority Tasks (Do First):**
1. ? F1-001 - Generate VS project files
2. ? F1-002 - Build in Visual Studio
3. ? F1-003 - Open in Unreal Editor
4. ? F1-004 - Create BP_ParadePlayer
5. ? F1-007 - Test WASD movement

**Secondary Tasks (Do Next):**
6. ? F1-006 - Configure player settings
7. ? F1-008 - Test click-to-move
8. ? F1-009 - Adjust camera settings

---

## ?? Notes & Blockers

### Current Blockers
- None yet (just starting!)

### Technical Debt
- None yet (clean start)

### Questions / Decisions Needed
- Which MetaHuman to use for player?
- What art style for floats? (realistic vs. stylized)
- Which collectible meshes to create first?

---

## ?? Completed This Week
- (None yet - just starting!)

---

**Last Updated:** Today
**Next Review:** End of Week 1
**Sprint Duration:** 2 weeks per phase
