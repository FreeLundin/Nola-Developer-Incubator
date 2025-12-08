# Running Both Versions Side-by-Side

## ?? Overview

This guide explains how to run the **React Three.js web version** and the **Unreal Engine version** simultaneously, sharing the same backend infrastructure.

---

## ??? Architecture

```
              ???????????????????????
?  Express Backend    ?
  ?  (Port 5000) ?
            ?  - API Routes       ?
          ?  - Database   ?
     ?  - Session Mgmt     ?
     ???????????????????????
  ?
                ???????????????????????????????
    ?       ?
    ????????????????????????      ????????????????????????
    ?  React Three.js      ?      ?  Unreal Engine       ?
    ?  (Web Browser)       ?      ?  (Native App)        ?
    ?  - Port 5000      ?      ?  - HTTP Client       ?
    ?  - WebGL Rendering   ?   ?  - Native Rendering  ?
    ?  - React Components  ?      ?  - Blueprints/C++    ?
    ????????????????????????      ????????????????????????
```

---

## ?? Directory Structure

```
C:\Users\BLund\source\repos\FreeLundin\Nola-Developer-Incubator\
??? client/  # React Three.js frontend (EXISTING)
?   ??? src/
?   ??? public/
?   ??? package.json
??? server/           # Express backend (SHARED)
?   ??? index.ts
?   ??? routes.ts
?   ??? storage.ts
??? shared/         # Database schema (SHARED)
?   ??? schema.ts
??? unreal/          # NEW: Unreal Engine project
?   ??? MardiGrasParade.uproject
?   ??? Source/
?   ??? Content/
?   ??? Config/
??? package.json # Root package.json (web version)
??? tsconfig.json   # TypeScript config
??? vite.config.ts       # Vite config
```

---

## ?? Setup Instructions

### Step 1: Ensure Web Version Works

```bash
# In the root directory
cd C:\Users\BLund\source\repos\FreeLundin\Nola-Developer-Incubator

# Install dependencies (if not already)
npm install

# Run development server (serves both frontend and backend)
npm run dev

# The server will start on http://localhost:5000
# Open your browser and verify the game works
```

**Expected Output:**
```
serving on port 5000
```

### Step 2: Create Unreal Project Directory

```bash
# Create unreal directory
mkdir unreal
cd unreal

# This is where you'll create the Unreal Engine project
# (We'll do this through Unreal Editor in the next step)
```

### Step 3: Create Unreal Engine Project

**Using Unreal Engine Editor:**

1. **Launch Unreal Engine Launcher**
2. **Click "Launch" on Unreal Engine 5.4** (or latest version)
3. **Create New Project:**
   - Games Category
   - Third Person Template
   - Project Settings:
     - Project Type: **C++ (or Blueprint if you prefer)**
 - Target Platform: **Desktop and Mobile**
     - Quality Preset: **Scalable**
     - Starter Content: **No** (we'll create custom assets)
   - Project Location: `C:\Users\BLund\source\repos\FreeLundin\Nola-Developer-Incubator\unreal`
   - Project Name: **MardiGrasParade**

4. **Click "Create"**

Your project structure will be:
```
unreal/
??? MardiGrasParade/
    ??? MardiGrasParade.uproject
    ??? Source/
    ??? Content/
    ??? Config/
    ??? Intermediate/
```

### Step 4: Configure Git for Both Projects

**Update `.gitignore` in root directory:**

```bash
# Add to existing .gitignore
echo "" >> .gitignore
echo "# Unreal Engine" >> .gitignore
echo "unreal/MardiGrasParade/Intermediate/" >> .gitignore
echo "unreal/MardiGrasParade/Saved/" >> .gitignore
echo "unreal/MardiGrasParade/Binaries/" >> .gitignore
echo "unreal/MardiGrasParade/DerivedDataCache/" >> .gitignore
echo "unreal/MardiGrasParade/.vs/" >> .gitignore
echo "*.sln" >> .gitignore
```

**Create `.gitattributes` for Large File Support:**

```bash
# Create .gitattributes in root
echo "# Unreal Engine LFS" > .gitattributes
echo "*.uasset filter=lfs diff=lfs merge=lfs -text" >> .gitattributes
echo "*.umap filter=lfs diff=lfs merge=lfs -text" >> .gitattributes
echo "*.fbx filter=lfs diff=lfs merge=lfs -text" >> .gitattributes
echo "*.png filter=lfs diff=lfs merge=lfs -text" >> .gitattributes
echo "*.tga filter=lfs diff=lfs merge=lfs -text" >> .gitattributes
echo "*.wav filter=lfs diff=lfs merge=lfs -text" >> .gitattributes
echo "*.mp3 filter=lfs diff=lfs merge=lfs -text" >> .gitattributes
```

**Install Git LFS:**
```bash
git lfs install
```

---

## ?? Running Both Versions Simultaneously

### Option 1: Same Backend (Recommended)

**Terminal 1 - Run Backend (serves web version too):**
```bash
# In root directory
npm run dev
```

**Terminal 2 - Run Unreal Editor:**
```bash
# Open Unreal project
cd unreal/MardiGrasParade
start MardiGrasParade.uproject
```

**In Unreal Editor:**
- Press **Play** button or **Alt+P** to test in editor
- Unreal will connect to `http://localhost:5000` for API calls

**Testing:**
- Web version: http://localhost:5000
- Unreal version: Running in Unreal Editor (Play mode)
- Both share the same backend and database

### Option 2: Separate Backend Ports (For Testing)

If you need to test different backend versions:

**Terminal 1 - Web Backend:**
```bash
# In root directory
npm run dev
# Runs on port 5000
```

**Terminal 2 - Unreal Backend (Modified Port):**

Create `server/index-unreal.ts` (copy of `server/index.ts`):
```typescript
// Change port to 5001
const port = 5001;
server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
}, () => {
  log(`[UNREAL] serving on port ${port}`);
});
```

Run it:
```bash
npx tsx server/index-unreal.ts
```

**Configure Unreal to use port 5001:**
- In Unreal: Edit `Config/DefaultEngine.ini`
- Add:
```ini
[/Script/MardiGrasParade.APIConfig]
BackendURL="http://localhost:5001"
```

---

## ?? Backend API Integration

### Shared Backend Routes

Both versions use the same API routes defined in `server/routes.ts`.

**Example API Endpoints to Implement:**

```typescript
// server/routes.ts
export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get leaderboard (shared by both versions)
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getTopScores(10);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Save game progress (shared)
  app.post("/api/save", async (req, res) => {
    try {
      const { userId, score, level, coins } = req.body;
      await storage.saveGameProgress({ userId, score, level, coins });
      res.json({ success: true });
 } catch (error) {
      res.status(500).json({ error: "Failed to save game" });
    }
  });

  // Get user profile (shared)
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      res.json(profile);
    } catch (error) {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Unlock skin (shared)
  app.post("/api/skins/unlock", async (req, res) => {
    try {
      const { userId, skinId } = req.body;
      await storage.unlockSkin(userId, skinId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to unlock skin" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
```

### Calling API from Unreal Engine

**C++ HTTP Client:**

```cpp
// ParadeAPIClient.h
#pragma once

#include "CoreMinimal.h"
#include "Http.h"
#include "Json.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "ParadeAPIClient.generated.h"

UCLASS()
class UParadeAPIClient : public UGameInstanceSubsystem
{
    GENERATED_BODY()

public:
    // Easily configurable in Blueprint
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "API")
 FString BackendURL = "http://localhost:5000";

// Get leaderboard
    UFUNCTION(BlueprintCallable, Category = "API")
    void GetLeaderboard(FOnLeaderboardReceived Callback);

    // Save game progress
    UFUNCTION(BlueprintCallable, Category = "API")
    void SaveGameProgress(int32 UserId, int32 Score, int32 Level, int32 Coins);

    // Unlock skin
    UFUNCTION(BlueprintCallable, Category = "API")
    void UnlockSkin(int32 UserId, FString SkinId);

private:
    void OnLeaderboardResponse(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bSuccess);
};
```

**Blueprint Usage (No Code Required):**

```
Event Graph:
??? Event: On Level Complete
?   ??? Get API Client (Get Game Instance Subsystem)
?   ??? Save Game Progress
?   ?   ??? User ID: Get from Game State
?   ?   ??? Score: Get from Game State
?   ?   ??? Level: Get from Game State
?   ?   ??? Coins: Get from Game State
? ??? Print String: "Progress saved!"
```

---

## ?? Feature Parity Checklist

Use this to ensure both versions have the same features:

| Feature | Web Version | Unreal Version | Status |
|---------|-------------|----------------|--------|
| Player Movement | ? | ?? | In Progress |
| Click-to-Move | ? | ?? | Not Started |
| Parade Floats | ? | ?? | Not Started |
| Collectibles | ? | ?? | Not Started |
| Competitor Bots | ? | ?? | Not Started |
| Aggressive NPCs | ? | ?? | Not Started |
| Power-Ups | ? | ?? | Not Started |
| Combo System | ? | ?? | Not Started |
| Color Matching | ? | ?? | Not Started |
| Level Progression | ? | ?? | Not Started |
| Touch Controls | ? | ?? | Not Started |
| Audio System | ? | ?? | Not Started |
| UI/HUD | ? | ?? | Not Started |
| Settings Menu | ? | ?? | Not Started |
| Save/Load | ? | ?? | Not Started |
| Leaderboard | ? | ?? | Not Started |
| Skins System | ? | ?? | Not Started |
| Monetization | ? | ?? | Not Started |

---

## ?? Testing Both Versions

### Local Development Testing

**Test Web Version:**
```bash
# Terminal 1
npm run dev

# Open browser
# Navigate to http://localhost:5000
# Play game and verify features
```

**Test Unreal Version:**
```bash
# Ensure backend is running (Terminal 1 above)

# Open Unreal Editor
cd unreal/MardiGrasParade
start MardiGrasParade.uproject

# Click Play in Editor (Alt+P)
# Test game features
```

**Test API Integration:**
```bash
# Terminal 2 - Monitor backend logs
# You should see API requests from both versions

# Web version logs:
GET /api/leaderboard 200 in 45ms :: [...]

# Unreal version logs (when implemented):
POST /api/save 200 in 12ms :: {"success":true}
```

### Cross-Version Testing Scenarios

#### Scenario 1: Shared Leaderboard
```
1. Play web version, get high score
2. Save score to backend (POST /api/save)
3. Play Unreal version
4. Fetch leaderboard (GET /api/leaderboard)
5. Verify web score appears in Unreal leaderboard
```

#### Scenario 2: Skin Unlocks
```
1. Unlock skin in web version (spends coins)
2. Backend updates user profile
3. Open Unreal version
4. Fetch user profile (GET /api/profile/:userId)
5. Verify skin is unlocked in Unreal
```

#### Scenario 3: Cross-Platform Progression
```
1. Play to level 3 in web version
2. Save progress to backend
3. Close web version
4. Open Unreal version
5. Load saved game (GET /api/profile/:userId)
6. Verify starting at level 3
```

---

## ?? Database Schema (Shared)

Update `shared/schema.ts` to support both versions:

```typescript
// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  highScore: integer("high_score").default(0),
  highestLevel: integer("highest_level").default(1),
  totalCoins: integer("total_coins").default(0),
  totalCatches: integer("total_catches").default(0),
  maxCombo: integer("max_combo").default(0),
  platform: text("platform").notNull(), // "web" or "unreal"
  lastPlayed: timestamp("last_played").defaultNow(),
});

export const unlockedSkins = pgTable("unlocked_skins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skinId: text("skin_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  score: integer("score").notNull(),
  level: integer("level").notNull(),
  platform: text("platform").notNull(), // "web" or "unreal"
  achievedAt: timestamp("achieved_at").defaultNow(),
});

export const insertGameProgressSchema = createInsertSchema(gameProgress);
export const insertLeaderboardSchema = createInsertSchema(leaderboard);

export type User = typeof users.$inferSelect;
export type GameProgress = typeof gameProgress.$inferSelect;
export type UnlockedSkin = typeof unlockedSkins.$inferSelect;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
```

**Push schema to database:**
```bash
npm run db:push
```

---

## ?? Configuration Files

### Web Version Config (Existing)

**`vite.config.ts`** - Already configured

### Unreal Version Config (New)

**`unreal/MardiGrasParade/Config/DefaultEngine.ini`**

Add API configuration:
```ini
[/Script/MardiGrasParade.APIConfig]
; Backend URL (changeable in Blueprint)
BackendURL="http://localhost:5000"

; Platform identifier
Platform="unreal"

; Enable API logging
bEnableAPILogs=True
```

**`unreal/MardiGrasParade/Config/DefaultGame.ini`**

Add game-specific settings:
```ini
[/Script/MardiGrasParade.ParadeGameMode]
; Starting values (same as web version)
StartingLevel=1
StartingTargetScore=5
StartingTotalFloats=10

; Difficulty curve (same as web version)
FloatsPerLevel=10
TargetScoreIncrement=2

; Feature flags
bEnableCrossProgression=True
bEnableLeaderboard=True
bEnableMonetization=True
```

---

## ?? Deployment Strategy

### Web Version (Current)

**Development:**
```bash
npm run dev  # Local development
```

**Production:**
```bash
npm run build  # Build for production
npm run start  # Run production server
```

**Deploy to:**
- Vercel, Netlify, or Replit
- Backend on separate server (Railway, Render, etc.)

### Unreal Version (New)

**Development:**
- Play in Unreal Editor (PIE - Play In Editor)
- Package for testing:
  - Windows: File > Package Project > Windows
  - Android: File > Package Project > Android
  - iOS: File > Package Project > iOS (requires Mac)

**Production:**
- **Steam (PC):**
  - Package for Windows x64
  - Upload to Steamworks
  - Configure Steam achievements, leaderboards

- **Mobile (iOS/Android):**
  - Package for iOS (requires Mac + Xcode)
  - Package for Android (requires Android SDK)
  - Upload to App Store / Google Play

---

## ?? Environment Variables

### Shared `.env` file (root directory)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mardigras"

# Session
SESSION_SECRET="your-secret-key-here"

# API
API_PORT=5000
CORS_ORIGIN="http://localhost:5000"

# Monetization (if using)
ADMOB_APP_ID="ca-app-pub-xxxxx"
ADMOB_REWARDED_ID="ca-app-pub-xxxxx/xxxxx"

# Steam (if using)
STEAM_APP_ID="your-steam-app-id"
STEAM_API_KEY="your-steam-api-key"
```

**Load in Web Version:**
- Already loaded via `dotenv` in `server/index.ts`

**Load in Unreal Version:**
- Read from config file or environment
- Create `UConfigManager` Blueprint to load settings

---

## ?? Monitoring Both Versions

### Backend Logs

Modify `server/index.ts` to add platform tracking:

```typescript
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const platform = req.headers['x-platform'] || 'unknown'; // Web or Unreal

res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`[${platform.toUpperCase()}] ${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});
```

**Expected output:**
```
[WEB] GET /api/leaderboard 200 in 45ms
[UNREAL] POST /api/save 200 in 12ms
[WEB] GET /api/profile/123 200 in 8ms
[UNREAL] GET /api/leaderboard 200 in 50ms
```

### Analytics Integration (Optional)

Track usage across both versions:

```typescript
// server/analytics.ts
export function trackEvent(platform: 'web' | 'unreal', event: string, data: any) {
  console.log(`[ANALYTICS] ${platform} - ${event}:`, data);
  
  // Send to analytics service (Google Analytics, Mixpanel, etc.)
  // ...
}

// Usage in routes
app.post("/api/save", async (req, res) => {
  const platform = req.headers['x-platform'] as 'web' | 'unreal';
  trackEvent(platform, 'game_saved', { userId: req.body.userId });
  // ... save logic
});
```

---

## ??? Development Workflow

### Daily Development Routine

**Morning:**
1. Pull latest changes: `git pull origin main`
2. Start backend: `npm run dev` (Terminal 1)
3. Open web version: http://localhost:5000
4. Open Unreal Editor: `start unreal/MardiGrasParade/MardiGrasParade.uproject`

**During Development:**
- Make changes to web version ? Test in browser
- Make changes to Unreal version ? Test in editor (Play mode)
- Both use same backend automatically

**Before Committing:**
1. Test both versions work
2. Verify API endpoints work for both
3. Check no compilation errors in Unreal
4. Commit changes:
```bash
git add .
git commit -m "feat: added [feature] to both versions"
git push origin main
```

### Version Control Best Practices

**Branching Strategy:**
```
main (production-ready)
??? feature/web-[feature-name]
??? feature/unreal-[feature-name]
??? feature/shared-[feature-name]
```

**Commit Message Format:**
```
[web] feat: added joystick controls
[unreal] feat: implemented parade float AI
[shared] feat: added leaderboard API endpoint
[both] fix: corrected combo calculation
```

---

## ?? Quick Reference Commands

### Web Version
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Type check
npm run check

# Database
npm run db:push
```

### Unreal Version
```bash
# Open project
cd unreal/MardiGrasParade
start MardiGrasParade.uproject

# Package for Windows (from Unreal Editor)
# File > Package Project > Windows (64-bit)

# Package for Android (from Unreal Editor)
# File > Package Project > Android

# Generate Visual Studio project files (if needed)
# Right-click MardiGrasParade.uproject > Generate Visual Studio project files
```

### Both Versions
```bash
# Start backend (required for both)
npm run dev

# Monitor logs
# Watch Terminal output for API calls from both versions
```

---

## ?? Troubleshooting

### Issue: Unreal can't connect to backend

**Solution:**
1. Check backend is running: `http://localhost:5000`
2. Verify Unreal config: `Config/DefaultEngine.ini`
3. Check firewall not blocking localhost
4. Try accessing API manually:
```bash
curl http://localhost:5000/api/leaderboard
```

### Issue: CORS errors in Unreal

**Solution:**
Update `server/index.ts`:
```typescript
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-platform");
  next();
});
```

### Issue: Database schema out of sync

**Solution:**
```bash
npm run db:push
```

### Issue: Unreal project won't compile

**Solution:**
1. Close Unreal Editor
2. Delete `Intermediate`, `Binaries`, `Saved` folders
3. Right-click `.uproject` ? Generate Visual Studio project files
4. Open in Visual Studio ? Build Solution
5. Open `.uproject` again

---

## ?? Getting Help

**Web Version Issues:**
- Check React Three.js docs: docs.pmnd.rs/react-three-fiber
- Vite issues: vitejs.dev

**Unreal Version Issues:**
- Unreal Forums: forums.unrealengine.com
- Unreal Discord: unrealslackers.org
- Documentation: docs.unrealengine.com

**Backend Issues:**
- Express docs: expressjs.com
- Drizzle ORM: orm.drizzle.team

---

## ? Pre-Launch Checklist

Before launching both versions:

**Technical:**
- [ ] Both versions connect to backend successfully
- [ ] Database schema supports both platforms
- [ ] API endpoints work for both versions
- [ ] Save/load works across platforms
- [ ] Leaderboard shows entries from both versions
- [ ] Performance targets met on all platforms

**Content:**
- [ ] Feature parity between versions (see checklist above)
- [ ] All assets created and imported
- [ ] Audio implemented in both versions
- [ ] UI/UX consistent across platforms

**Business:**
- [ ] Monetization implemented (if applicable)
- [ ] Analytics tracking both versions
- [ ] Privacy policy updated for both platforms
- [ ] Terms of service cover both versions

---

**Document Version:** 1.0  
**Last Updated:** {{ Current Date }}  
**Maintained By:** Development Team

---

## ?? Success!

You now have a complete guide to running both versions side-by-side. Follow the setup instructions, use the testing scenarios, and reference the troubleshooting section as needed.

**Happy developing!** ??
