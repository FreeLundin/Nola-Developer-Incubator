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
  collectibles: Collectible[];
  
  // Actions
  startGame: () => void;
  toggleCamera: () => void;
  addCatch: () => void;
  addCollectible: (collectible: Collectible) => void;
  updateCollectible: (id: string, updates: Partial<Collectible>) => void;
  removeCollectible: (id: string) => void;
  resetGame: () => void;
}

export const useParadeGame = create<ParadeGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "tutorial",
    cameraMode: "third-person",
    score: 0,
    targetScore: 5,
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
      const { score, targetScore } = get();
      const newScore = score + 1;
      console.log(`Catch! Score: ${newScore}/${targetScore}`);
      
      if (newScore >= targetScore) {
        set({ score: newScore, phase: "won" });
      } else {
        set({ score: newScore });
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
    
    resetGame: () => {
      console.log("Resetting game...");
      set({
        phase: "tutorial",
        score: 0,
        collectibles: [],
        cameraMode: "third-person",
      });
    },
  }))
);
