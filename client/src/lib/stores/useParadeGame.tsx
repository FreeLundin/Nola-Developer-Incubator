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
  type: "beads" | "doubloon" | "cup";
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
  
  // Actions
  startGame: () => void;
  toggleCamera: () => void;
  addCatch: () => void;
  addCollectible: (collectible: Collectible) => void;
  updateCollectible: (id: string, updates: Partial<Collectible>) => void;
  removeCollectible: (id: string) => void;
  resetGame: () => void;
  nextLevel: () => void;
  getFloatSpeed: () => number;
  getThrowInterval: () => number;
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
    
    startGame: () => {
      console.log("Starting game...");
      set({ phase: "playing" });
    },
    
    toggleCamera: () => {
      const currentMode = get().cameraMode;
      const newMode = currentMode === "third-person" ? "first-person" : "third-person";
      console.log(`Camera mode: ${currentMode} -> ${newMode}`);
      set({ cameraMode: newMode });
    },
    
    addCatch: () => {
      const { score, targetScore, combo, maxCombo, lastCatchTime, totalCatches } = get();
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
      const newScore = score + 1;
      const newTotalCatches = totalCatches + 1;
      
      console.log(`Catch! Score: ${newScore}/${targetScore}, Combo: ${newCombo}x`);
      
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
  }))
);
