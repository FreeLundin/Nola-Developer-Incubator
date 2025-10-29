import { useState, useEffect, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useAudio } from "@/lib/stores/useAudio";
import { Player, Controls } from "./Player";
import { GameCamera } from "./GameCamera";
import { Environment } from "./Environment";
import { ParadeFloat } from "./ParadeFloat";
import { Collectible } from "./Collectible";
import { CatchEffect } from "./CatchEffect";
import { ClickMarker } from "./ClickMarker";
import { CompetitorBot } from "./CompetitorBot";
import { TouchInput } from "./TouchControls";
import * as THREE from "three";

interface CatchEffectInstance {
  id: string;
  position: THREE.Vector3;
  color: string;
}

interface ClickMarkerInstance {
  id: string;
  position: THREE.Vector3;
}

interface GameSceneProps {
  touchInput: TouchInput;
  catchAction: number;
}

export function GameScene({ touchInput, catchAction }: GameSceneProps) {
  const { phase, collectibles, addCatch, combo } = useParadeGame();
  const { playHit, playFireworks } = useAudio();
  const { camera, gl } = useThree();
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0.5, 0));
  const [mouseTarget, setMouseTarget] = useState<THREE.Vector3 | null>(null);
  const [catchEffects, setCatchEffects] = useState<CatchEffectInstance[]>([]);
  const [clickMarkers, setClickMarkers] = useState<ClickMarkerInstance[]>([]);
  
  // Play fireworks sound on high combos
  useEffect(() => {
    if (combo >= 3) {
      playFireworks();
    }
  }, [combo, playFireworks]);
  
  // Handle mouse click for movement
  useEffect(() => {
    if (phase !== "playing") return;
    
    const handleClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Create raycaster
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      // Create a ground plane to raycast against
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      
      // Get intersection point - check if it succeeded
      const intersected = raycaster.ray.intersectPlane(groundPlane, target);
      
      if (intersected) {
        // Constrain to street bounds
        target.x = THREE.MathUtils.clamp(target.x, -6.5, 6.5);
        target.z = THREE.MathUtils.clamp(target.z, -15, 15);
        target.y = 0.5; // Player height
        
        setMouseTarget(target.clone());
        
        // Add click marker
        const markerId = `click-${Date.now()}`;
        setClickMarkers((prev) => [
          ...prev,
          {
            id: markerId,
            position: target.clone(),
          },
        ]);
        
        console.log("Mouse click target:", target);
      }
    };
    
    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [phase, camera, gl]);
  
  // Handle clearing mouse target
  const handleClearMouseTarget = useCallback(() => {
    setMouseTarget(null);
  }, []);
  
  // Handle player catch
  const handleCatch = useCallback((type: "beads" | "doubloon" | "cup" | "king_cake" | "speed_boost" | "double_points") => {
    console.log("Catch successful!", type);
    playHit();
    
    const isPowerUp = type === "speed_boost" || type === "double_points";
    const isSpecial = type === "king_cake";
    
    if (isPowerUp) {
      // Activate power-up
      useParadeGame.getState().activatePowerUp(type as "speed_boost" | "double_points");
    } else if (isSpecial) {
      // King cake worth flat 5 points (bypasses power-ups and color bonuses)
      for (let i = 0; i < 5; i++) {
        addCatch(undefined, true); // Bypass power-up multiplier
      }
    } else {
      // Regular collectible - pass type for color matching
      addCatch(type);
    }
    
    // Add catch effect
    const effectId = `catch-${Date.now()}`;
    const effectColor = isPowerUp ? "#00ffff" : isSpecial ? "#ff6b35" : "#ffd700";
    setCatchEffects((prev) => [
      ...prev,
      {
        id: effectId,
        position: playerPosition.clone(),
        color: effectColor,
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
      
      {/* Player - starts behind center line */}
      <Player 
        position={[0, 0.5, -8]} 
        onPositionChange={setPlayerPosition} 
        touchInput={touchInput} 
        mouseTarget={mouseTarget}
        onClearMouseTarget={handleClearMouseTarget}
      />
      
      {/* Camera */}
      <GameCamera playerPosition={playerPosition} />
      
      {/* Gameplay elements only during playing phase */}
      {phase === "playing" && (
        <>
          {/* Parade Floats - all on right side of street, passing player position for targeted throws */}
          <ParadeFloat id="float-1" startZ={-25} lane={1} color="#9b59b6" playerPosition={playerPosition} />
          <ParadeFloat id="float-2" startZ={-15} lane={1} color="#e74c3c" playerPosition={playerPosition} />
          <ParadeFloat id="float-3" startZ={-35} lane={1} color="#ff6b35" playerPosition={playerPosition} />
          <ParadeFloat id="float-4" startZ={-5} lane={1} color="#3498db" playerPosition={playerPosition} />
          
          {/* Competitor Bots - competing for catches */}
          <CompetitorBot id="bot-1" startX={-4} color="#ff4444" />
          <CompetitorBot id="bot-2" startX={2} color="#44ff44" />
          <CompetitorBot id="bot-3" startX={-2} color="#4444ff" />
          <CompetitorBot id="bot-4" startX={4} color="#ffff44" />
          
          {/* Collectibles */}
          {collectibles.map((collectible) => (
            <Collectible
              key={collectible.id}
              collectible={collectible}
              playerPosition={playerPosition}
              onCatch={handleCatch}
              catchAction={catchAction}
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
          
          {/* Click Markers */}
          {clickMarkers.map((marker) => (
            <ClickMarker
              key={marker.id}
              position={marker.position}
              onComplete={() => {
                setClickMarkers((prev) => prev.filter((m) => m.id !== marker.id));
              }}
            />
          ))}
        </>
      )}
    </group>
  );
}
