import { useState, useEffect, useCallback } from "react";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useAudio } from "@/lib/stores/useAudio";
import { Player, Controls } from "./Player";
import { GameCamera } from "./GameCamera";
import { Environment } from "./Environment";
import { ParadeFloat } from "./ParadeFloat";
import { Collectible } from "./Collectible";
import { CatchEffect } from "./CatchEffect";
import { TouchInput } from "./TouchControls";
import * as THREE from "three";

interface CatchEffectInstance {
  id: string;
  position: THREE.Vector3;
  color: string;
}

interface GameSceneProps {
  touchInput: TouchInput;
}

export function GameScene({ touchInput }: GameSceneProps) {
  const { phase, collectibles, addCatch, toggleCamera } = useParadeGame();
  const { playHit } = useAudio();
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0.5, 0));
  const [catchEffects, setCatchEffects] = useState<CatchEffectInstance[]>([]);
  
  // Handle keyboard camera toggle (C key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "KeyC" && phase === "playing") {
        console.log("Camera toggle key pressed");
        toggleCamera();
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleCamera, phase]);
  
  // Handle player catch
  const handleCatch = useCallback(() => {
    console.log("Catch successful!");
    playHit();
    addCatch();
    
    // Add catch effect
    const effectId = `catch-${Date.now()}`;
    setCatchEffects((prev) => [
      ...prev,
      {
        id: effectId,
        position: playerPosition.clone(),
        color: "#ffd700",
      },
    ]);
    
    // Remove effect after duration
    setTimeout(() => {
      setCatchEffects((prev) => prev.filter((e) => e.id !== effectId));
    }, 1100);
  }, [playHit, addCatch, playerPosition]);
  
  return (
    <group>
      {/* Environment - always visible */}
      <Environment />
      
      {/* Player */}
      <Player position={[0, 0.5, 0]} onPositionChange={setPlayerPosition} touchInput={touchInput} />
      
      {/* Camera */}
      <GameCamera playerPosition={playerPosition} />
      
      {/* Gameplay elements only during playing phase */}
      {phase === "playing" && (
        <>
          {/* Parade Floats - no longer need throwInterval, it's dynamic */}
          <ParadeFloat id="float-1" startZ={-25} lane={-1} color="#9b59b6" />
          <ParadeFloat id="float-2" startZ={-15} lane={1} color="#e74c3c" />
          <ParadeFloat id="float-3" startZ={-35} lane={-1} color="#ff6b35" />
          <ParadeFloat id="float-4" startZ={-5} lane={1} color="#3498db" />
          
          {/* Collectibles */}
          {collectibles.map((collectible) => (
            <Collectible
              key={collectible.id}
              collectible={collectible}
              playerPosition={playerPosition}
              onCatch={handleCatch}
            />
          ))}
          
          {/* Catch Effects */}
          {catchEffects.map((effect) => (
            <CatchEffect
              key={effect.id}
              position={effect.position}
              color={effect.color}
              onComplete={() => {
                setCatchEffects((prev) => prev.filter((e) => e.id !== effect.id));
              }}
            />
          ))}
        </>
      )}
    </group>
  );
}
