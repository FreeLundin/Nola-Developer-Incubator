import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export type GamePhase = "tutorial" | "playing" | "won";
export type CameraMode = "third-person" | "first-person";

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
  
  // Actions
  startGame: () => void;
  toggleCamera: () => void;
  addCatch: (collectibleType?: Collectible["type"], bypassPowerUp?: boolean) => void;
  addCollectible: (collectible: Collectible) => void;
  updateCollectible: (id: string, updates: Partial<Collectible>) => void;
  removeCollectible: (id: string) => void;
  resetGame: () => void;
  nextLevel: () => void;
  getFloatSpeed: () => number;
  getThrowInterval: () => number;
  activatePowerUp: (type: PowerUp["type"]) => void;
  hasActivePowerUp: (type: PowerUp["type"]) => boolean;
  getMoveSpeedMultiplier: () => number;
}

// Combo timing window (milliseconds)
const COMBO_WINDOW = 3000;

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
    
    startGame: () => {
      console.log("Starting game...");
      // Randomly assign player color from the three main collectible types
      const colors: Array<"beads" | "doubloon" | "cup"> = ["beads", "doubloon", "cup"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      console.log(`Player color assigned: ${randomColor}`);
      set({ phase: "playing", playerColor: randomColor });
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
      
      if (newScore >= targetScore) {
        set({ 
          score: newScore, 
          phase: "won",
          combo: newCombo,
          maxCombo: newMaxCombo,
          lastCatchTime: now,
          totalCatches: newTotalCatches,
        });
      } else {
        set({ 
          score: newScore,
          combo: newCombo,
          maxCombo: newMaxCombo,
          lastCatchTime: now,
          totalCatches: newTotalCatches,
        });
      }
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
      set((state) => ({
        collectibles: state.collectibles.filter((c) => c.id !== id),
      }));
    },
    
    nextLevel: () => {
      const { level, totalCatches } = get();
      const newLevel = level + 1;
      const newTargetScore = 5 + (newLevel - 1) * 2; // Increase target each level: 5, 7, 9, 11...
      
      console.log(`Advancing to level ${newLevel}! New target: ${newTargetScore} catches`);
      
      set({
        level: newLevel,
        targetScore: newTargetScore,
        score: 0,
        combo: 0,
        lastCatchTime: 0,
        phase: "playing",
        collectibles: [],
      });
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
  }))
);
