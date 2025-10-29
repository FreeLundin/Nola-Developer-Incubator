import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export type GamePhase = "tutorial" | "playing" | "won" | "ad_offer";
export type CameraMode = "third-person" | "first-person";
export type PlayerSkin = "default" | "golden" | "rainbow" | "ghost" | "king" | "jester";

export interface Collectible {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  active: boolean;
  type: "beads" | "doubloon" | "cup" | "king_cake" | "speed_boost" | "double_points";
}

export interface PowerUp {
  type: "speed_boost" | "double_points";
  endTime: number;
}

interface BotScore {
  id: string;
  catches: number;
  color: string;
}

interface BotClaim {
  botId: string;
  claimTime: number;
}

export interface AggressiveNPC {
  id: string;
  position: [number, number, number];
  isChasing: boolean;
  chaseEndTime: number | null;
}

interface ParadeGameState {
  phase: GamePhase;
  cameraMode: CameraMode;
  score: number;
  targetScore: number;
  level: number;
  totalCatches: number;
  combo: number;
  maxCombo: number;
  lastCatchTime: number;
  collectibles: Collectible[];
  activePowerUps: PowerUp[];
  playerColor: "beads" | "doubloon" | "cup"; // Player's assigned color for bonus points
  missedThrows: number; // Track missed throws for bot gift system
  botScores: BotScore[]; // Track bot catches
  botClaims: Record<string, BotClaim>; // Track which bot claimed which collectible
  totalFloats: number; // Total floats for current level (10 * level)
  floatsPassed: number; // How many floats have passed the player
  aggressiveNPCs: AggressiveNPC[]; // Aggressive NPCs that chase player when hit
  
  // Monetization features
  coins: number; // Currency earned from gameplay
  playerSkin: PlayerSkin; // Current cosmetic skin
  unlockedSkins: PlayerSkin[]; // Skins the player owns
  adRewardType: "continue" | "bonus_time" | "power_up" | null; // Type of reward for watching ad
  
  // Actions
  startGame: () => void;
  toggleCamera: () => void;
  addCatch: (collectibleType?: Collectible["type"], bypassPowerUp?: boolean) => void;
  incrementMisses: () => void;
  addBotCatch: (botId: string) => void;
  addCollectible: (collectible: Collectible) => void;
  updateCollectible: (id: string, updates: Partial<Collectible>) => void;
  removeCollectible: (id: string) => void;
  claimCollectible: (collectibleId: string, botId: string) => boolean;
  releaseCollectibleClaim: (collectibleId: string) => void;
  getCollectibleClaim: (collectibleId: string) => BotClaim | null;
  markFloatPassed: () => void;
  getTotalFloatsForLevel: (level: number) => number;
  resetGame: () => void;
  nextLevel: () => void;
  getFloatSpeed: () => number;
  getThrowInterval: () => number;
  activatePowerUp: (type: PowerUp["type"]) => void;
  hasActivePowerUp: (type: PowerUp["type"]) => boolean;
  getMoveSpeedMultiplier: () => number;
  
  // Monetization actions
  offerAdReward: (rewardType: "continue" | "bonus_time" | "power_up") => void;
  watchAd: () => void; // Player chooses to watch ad
  skipAd: () => void; // Player declines ad
  addCoins: (amount: number) => void;
  purchaseSkin: (skin: PlayerSkin) => boolean;
  setSkin: (skin: PlayerSkin) => void;
  
  // Inactivity timeout
  endGameDueToInactivity: () => void;
  
  // Float collision
  eliminatePlayer: () => void;
  
  // Aggressive NPC actions
  hitAggressiveNPC: (npcId: string) => void;
  aggressiveNPCHitPlayer: (npcId: string) => void;
  endNPCChase: (npcId: string) => void;
}

// Combo timing window (milliseconds)
const COMBO_WINDOW = 3000;

// Skin prices in coins
export const SKIN_PRICES: Record<PlayerSkin, number> = {
  default: 0,
  golden: 100,
  rainbow: 150,
  ghost: 200,
  king: 250,
  jester: 200,
};

export const useParadeGame = create<ParadeGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "tutorial",
    cameraMode: "third-person",
    score: 0,
    targetScore: 5,
    level: 1,
    totalCatches: 0,
    combo: 0,
    maxCombo: 0,
    lastCatchTime: 0,
    collectibles: [],
    activePowerUps: [],
    playerColor: "beads", // Default color, reassigned on game start
    missedThrows: 0,
    botScores: [],
    botClaims: {},
    totalFloats: 10, // Start with 10 floats for level 1
    floatsPassed: 0,
    aggressiveNPCs: [],
    
    // Monetization state
    coins: 0,
    playerSkin: "default",
    unlockedSkins: ["default"],
    adRewardType: null,
    
    startGame: () => {
      console.log("Starting game...");
      // Randomly assign player color from the three main collectible types
      const colors: Array<"beads" | "doubloon" | "cup"> = ["beads", "doubloon", "cup"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      console.log(`Player color assigned: ${randomColor}`);
      
      // Initialize bot scores
      const botColors = ["#ff4444", "#44ff44", "#4444ff", "#ffff44", "#ff44ff", "#44ffff"];
      const initialBotScores = Array.from({ length: 6 }, (_, i) => ({
        id: `bot-${i + 1}`,
        catches: 0,
        color: botColors[i],
      }));
      
      // Initialize aggressive NPCs (1 + level count, randompositions in catching area)
      const currentLevel = get().level;
      const npcCount = 1 + currentLevel; // Level 1: 2 NPCs, Level 2: 3 NPCs, etc.
      const initialAggressiveNPCs: AggressiveNPC[] = Array.from({ length: npcCount }, (_, i) => ({
        id: `aggressive-${i + 1}`,
        position: [
          Math.random() * 13 - 6.5, // Random x: -6.5 to 6.5
          0.5,
          Math.random() * 30 - 15, // Random z: -15 to 15
        ] as [number, number, number],
        isChasing: false,
        chaseEndTime: null,
      }));
      
      set({ 
        phase: "playing", 
        playerColor: randomColor, 
        botScores: initialBotScores,
        totalFloats: 10, // Level 1 starts with 10 floats
        floatsPassed: 0,
        aggressiveNPCs: initialAggressiveNPCs,
      });
    },
    
    addBotCatch: (botId: string) => {
      set((state) => ({
        botScores: state.botScores.map((bot) =>
          bot.id === botId ? { ...bot, catches: bot.catches + 1 } : bot
        ),
      }));
    },
    
    toggleCamera: () => {
      const currentMode = get().cameraMode;
      const newMode = currentMode === "third-person" ? "first-person" : "third-person";
      console.log(`Camera mode: ${currentMode} -> ${newMode}`);
      set({ cameraMode: newMode });
    },
    
    addCatch: (collectibleType, bypassPowerUp = false) => {
      const { score, targetScore, combo, maxCombo, lastCatchTime, totalCatches, hasActivePowerUp, playerColor } = get();
      const now = Date.now();
      const timeSinceLastCatch = now - lastCatchTime;
      
      // Update combo
      let newCombo = combo;
      if (timeSinceLastCatch < COMBO_WINDOW && lastCatchTime > 0) {
        newCombo = combo + 1;
      } else {
        newCombo = 1;
      }
      
      const newMaxCombo = Math.max(maxCombo, newCombo);
      
      // Check for color match bonus (3x bonus points for matching player color)
      const isColorMatch = collectibleType === playerColor;
      let basePoints = 1;
      if (isColorMatch) {
        basePoints = 3; // 3 points for matching color (triple points!)
        console.log(`🎨 COLOR MATCH! ${collectibleType} matches player color!`);
      }
      
      // Apply double points power-up (unless bypassed for special items like King Cake)
      const points = (!bypassPowerUp && hasActivePowerUp("double_points")) ? basePoints * 2 : basePoints;
      const newScore = score + points;
      const newTotalCatches = totalCatches + 1;
      
      console.log(`Catch! Score: +${points} = ${newScore}/${targetScore}, Combo: ${newCombo}x${isColorMatch ? " (COLOR MATCH!)" : ""}`);
      
      // Award coins for catches (1 coin per catch, bonus for combos)
      const coinReward = 1 + (newCombo >= 3 ? Math.floor(newCombo / 3) : 0);
      
      // Score is now just for points - floats represent time, not score
      set((state) => ({ 
        score: newScore,
        combo: newCombo,
        maxCombo: newMaxCombo,
        lastCatchTime: now,
        totalCatches: newTotalCatches,
        coins: state.coins + coinReward,
      }));
    },
    
    addCollectible: (collectible) => {
      set((state) => ({
        collectibles: [...state.collectibles, collectible],
      }));
    },
    
    updateCollectible: (id, updates) => {
      set((state) => ({
        collectibles: state.collectibles.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    
    removeCollectible: (id) => {
      set((state) => {
        // Also remove any claim on this collectible
        const newClaims = { ...state.botClaims };
        delete newClaims[id];
        
        return {
          collectibles: state.collectibles.filter((c) => c.id !== id),
          botClaims: newClaims,
        };
      });
    },
    
    claimCollectible: (collectibleId, botId) => {
      const { botClaims } = get();
      const existingClaim = botClaims[collectibleId];
      const now = Date.now();
      
      // If already claimed by another bot and claim is still valid (within 2 seconds), deny
      if (existingClaim && existingClaim.botId !== botId && (now - existingClaim.claimTime) < 2000) {
        return false; // Claim denied
      }
      
      // Otherwise, allow this bot to claim it
      set((state) => ({
        botClaims: {
          ...state.botClaims,
          [collectibleId]: { botId, claimTime: now },
        },
      }));
      return true; // Claim successful
    },
    
    releaseCollectibleClaim: (collectibleId) => {
      set((state) => {
        const newClaims = { ...state.botClaims };
        delete newClaims[collectibleId];
        return { botClaims: newClaims };
      });
    },
    
    getCollectibleClaim: (collectibleId) => {
      const { botClaims } = get();
      return botClaims[collectibleId] || null;
    },
    
    markFloatPassed: () => {
      const { floatsPassed, totalFloats } = get();
      const newFloatsPassed = floatsPassed + 1;
      
      console.log(`Float passed! ${newFloatsPassed}/${totalFloats}`);
      
      // Check if all floats have passed - level complete!
      if (newFloatsPassed >= totalFloats) {
        console.log("All floats have passed! Level complete!");
        set({ floatsPassed: newFloatsPassed });
        // Small delay before advancing level
        setTimeout(() => {
          get().nextLevel();
        }, 1000);
      } else {
        set({ floatsPassed: newFloatsPassed });
      }
    },
    
    getTotalFloatsForLevel: (level: number) => {
      return level * 10; // Level 1: 10 floats, Level 2: 20 floats, etc.
    },
    
    nextLevel: () => {
      const { level, totalCatches } = get();
      const newLevel = level + 1;
      const newTotalFloats = newLevel * 10; // 10 floats per level
      const newTargetScore = 5 + (newLevel - 1) * 2; // Increase target each level: 5, 7, 9, 11...
      
      // Generate more aggressive NPCs for higher levels (1 + level count)
      const npcCount = 1 + newLevel; // Level 2: 3 NPCs, Level 3: 4 NPCs, etc.
      const newAggressiveNPCs: AggressiveNPC[] = Array.from({ length: npcCount }, (_, i) => ({
        id: `aggressive-${newLevel}-${i + 1}`,
        position: [
          Math.random() * 13 - 6.5, // Random x: -6.5 to 6.5
          0.5,
          Math.random() * 30 - 15, // Random z: -15 to 15
        ] as [number, number, number],
        isChasing: false,
        chaseEndTime: null,
      }));
      
      console.log(`Advancing to level ${newLevel}! ${newTotalFloats} floats, ${npcCount} aggressive NPCs, ${2 + newLevel} obstacles`);
      
      set({
        level: newLevel,
        targetScore: newTargetScore,
        score: 0,
        combo: 0,
        lastCatchTime: 0,
        phase: "playing",
        collectibles: [],
        totalFloats: newTotalFloats,
        floatsPassed: 0,
        aggressiveNPCs: newAggressiveNPCs,
      });
    },
    
    incrementMisses: () => {
      const { missedThrows } = get();
      const newMissCount = missedThrows + 1;
      
      if (newMissCount >= 3) {
        console.log("🎁 Bot Gift! You missed 3 throws, bot gives you a bonus point!");
        // Reset counter and give player a point (but don't advance level - floats control that)
        const { score } = get();
        const newScore = score + 1;
        set({ missedThrows: 0, score: newScore });
      } else {
        set({ missedThrows: newMissCount });
        console.log(`Missed throw ${newMissCount}/3`);
      }
    },
    
    resetGame: () => {
      console.log("Resetting game...");
      // Reassign random player color
      const colors: Array<"beads" | "doubloon" | "cup"> = ["beads", "doubloon", "cup"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      set({
        phase: "tutorial",
        score: 0,
        level: 1,
        targetScore: 5,
        combo: 0,
        maxCombo: 0,
        lastCatchTime: 0,
        totalCatches: 0,
        collectibles: [],
        activePowerUps: [],
        playerColor: randomColor,
        missedThrows: 0,
        botScores: [],
        botClaims: {},
        totalFloats: 10,
        floatsPassed: 0,
        cameraMode: "third-person",
      });
    },
    
    // Dynamic difficulty - increases with level
    getFloatSpeed: () => {
      const { level } = get();
      return 2 + (level - 1) * 0.3; // Speed increases each level
    },
    
    getThrowInterval: () => {
      const { level } = get();
      return Math.max(1500, 3000 - (level - 1) * 200); // Throws get more frequent, min 1.5s
    },
    
    activatePowerUp: (type: PowerUp["type"]) => {
      const now = Date.now();
      const duration = 8000; // 8 seconds
      const endTime = now + duration;
      
      set((state) => ({
        activePowerUps: [
          ...state.activePowerUps.filter((p) => p.type !== type), // Remove existing same type
          { type, endTime },
        ],
      }));
      
      console.log(`Power-up activated: ${type} for ${duration/1000}s`);
      
      // Auto-remove after duration
      setTimeout(() => {
        set((state) => ({
          activePowerUps: state.activePowerUps.filter((p) => p.endTime !== endTime),
        }));
        console.log(`Power-up expired: ${type}`);
      }, duration);
    },
    
    hasActivePowerUp: (type: PowerUp["type"]) => {
      const { activePowerUps } = get();
      const now = Date.now();
      return activePowerUps.some((p) => p.type === type && p.endTime > now);
    },
    
    getMoveSpeedMultiplier: () => {
      return get().hasActivePowerUp("speed_boost") ? 1.5 : 1.0;
    },
    
    // Monetization actions
    offerAdReward: (rewardType: "continue" | "bonus_time" | "power_up") => {
      console.log(`Offering ad reward: ${rewardType}`);
      set({ phase: "ad_offer", adRewardType: rewardType });
    },
    
    watchAd: () => {
      const { adRewardType } = get();
      console.log(`Player watched ad for: ${adRewardType}`);
      
      // Simulate ad watching delay
      setTimeout(() => {
        if (adRewardType === "continue") {
          // Continue playing with bonus
          set({ phase: "playing", adRewardType: null });
          get().addCoins(10);
        } else if (adRewardType === "bonus_time") {
          // Add extra floats to extend level
          set((state) => ({
            totalFloats: state.totalFloats + 5,
            phase: "playing",
            adRewardType: null,
          }));
          get().addCoins(10);
        } else if (adRewardType === "power_up") {
          // Activate both power-ups
          get().activatePowerUp("speed_boost");
          get().activatePowerUp("double_points");
          set({ phase: "playing", adRewardType: null });
          get().addCoins(10);
        }
      }, 100);
    },
    
    skipAd: () => {
      console.log("Player declined ad");
      set({ phase: "won", adRewardType: null });
    },
    
    addCoins: (amount: number) => {
      set((state) => {
        const newCoins = state.coins + amount;
        console.log(`Coins: ${state.coins} + ${amount} = ${newCoins}`);
        return { coins: newCoins };
      });
    },
    
    purchaseSkin: (skin: PlayerSkin) => {
      const { coins, unlockedSkins } = get();
      const price = SKIN_PRICES[skin];
      
      if (unlockedSkins.includes(skin)) {
        console.log(`Skin ${skin} already unlocked`);
        return false;
      }
      
      if (coins < price) {
        console.log(`Not enough coins for ${skin}. Need ${price}, have ${coins}`);
        return false;
      }
      
      set((state) => ({
        coins: state.coins - price,
        unlockedSkins: [...state.unlockedSkins, skin],
        playerSkin: skin,
      }));
      
      console.log(`Purchased and equipped skin: ${skin} for ${price} coins`);
      return true;
    },
    
    setSkin: (skin: PlayerSkin) => {
      const { unlockedSkins } = get();
      
      if (!unlockedSkins.includes(skin)) {
        console.log(`Skin ${skin} not unlocked`);
        return;
      }
      
      set({ playerSkin: skin });
      console.log(`Equipped skin: ${skin}`);
    },
    
    endGameDueToInactivity: () => {
      console.log("Game ended due to inactivity (30 seconds without movement)");
      set({ phase: "won" });
    },
    
    eliminatePlayer: () => {
      console.log("💥 Player hit by parade float! Eliminated!");
      set({ phase: "won" });
    },
    
    hitAggressiveNPC: (npcId: string) => {
      console.log(`🔴 Player hit aggressive NPC ${npcId} - NPC is now chasing!`);
      set((state) => ({
        aggressiveNPCs: state.aggressiveNPCs.map((npc) =>
          npc.id === npcId
            ? { 
                ...npc, 
                isChasing: true, 
                chaseEndTime: Date.now() + 5000 // Chase for 5 seconds
              }
            : npc
        ),
        combo: 0, // Break combo when hitting aggressive NPC
      }));
    },
    
    aggressiveNPCHitPlayer: (npcId: string) => {
      console.log(`💥 Aggressive NPC ${npcId} hit player! -1 point`);
      set((state) => ({
        score: Math.max(0, state.score - 1), // Lose 1 point, minimum 0
        aggressiveNPCs: state.aggressiveNPCs.map((npc) =>
          npc.id === npcId
            ? { ...npc, isChasing: false, chaseEndTime: null }
            : npc
        ),
      }));
    },
    
    endNPCChase: (npcId: string) => {
      console.log(`⏰ Aggressive NPC ${npcId} stopped chasing (5 seconds elapsed)`);
      set((state) => ({
        aggressiveNPCs: state.aggressiveNPCs.map((npc) =>
          npc.id === npcId
            ? { ...npc, isChasing: false, chaseEndTime: null }
            : npc
        ),
      }));
    },
  }))
);
