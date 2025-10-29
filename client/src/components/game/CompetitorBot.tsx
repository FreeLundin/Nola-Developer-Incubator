import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import * as THREE from "three";

interface CompetitorBotProps {
  id: string;
  startX: number;
  startZ: number;
  color: string;
}

export function CompetitorBot({ id, startX, startZ, color }: CompetitorBotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const position = useRef(new THREE.Vector3(startX, 0.5, startZ)); // Start at assigned position
  const velocity = useRef(new THREE.Vector3());
  const { collectibles, removeCollectible, addBotCatch, phase } = useParadeGame();
  
  const moveSpeed = useMemo(() => Math.random() * 1.5 + 2.5, []); // Varying speeds (2.5-4)
  const targetPreference = useMemo(() => Math.random(), []); // Random preference for target selection
  const claimedTarget = useRef<string | null>(null); // Claimed collectible ID
  const targetClaimTime = useRef(0); // When target was claimed
  const CLAIM_DURATION = 2000; // Stick with a target for 2 seconds
  
  useEffect(() => {
    console.log(`Competitor bot ${id} spawned at (${startX.toFixed(1)}, ${startZ.toFixed(1)})`);
  }, [id, startX, startZ]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || !headRef.current || !shadowRef.current || phase !== "playing") return;
    
    const now = Date.now();
    
    // Check if we still have a valid claimed target
    let targetCollectible: typeof collectibles[0] | null = null;
    const hasValidClaim = claimedTarget.current && (now - targetClaimTime.current) < CLAIM_DURATION;
    
    if (hasValidClaim) {
      // Try to find our claimed target
      targetCollectible = collectibles.find(c => c.id === claimedTarget.current) || null;
      
      // If claimed target is gone or too high, release claim
      if (!targetCollectible || targetCollectible.position.y > 1.5) {
        claimedTarget.current = null;
        targetCollectible = null;
      }
    }
    
    // If we don't have a valid target, find a new one
    if (!targetCollectible) {
      let bestCollectible: typeof collectibles[0] | null = null;
      let bestScore = -Infinity;
      
      for (const collectible of collectibles) {
        // Only consider items that are low enough or on ground
        if (collectible.position.y < 1.5) {
          const distance = position.current.distanceTo(collectible.position);
          
          // Score based on distance and persistent preference (no per-frame randomness)
          const distanceScore = 20 - distance; // Closer = higher score
          
          // Use collectible ID hash for consistent per-item bias
          const itemBias = (collectible.id.charCodeAt(collectible.id.length - 1) % 10) - 5;
          
          // Individual bot preference (persistent)
          const preferenceBonus = targetPreference * 4;
          
          const totalScore = distanceScore + itemBias + preferenceBonus;
          
          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestCollectible = collectible;
          }
        }
      }
      
      // Claim the new target
      if (bestCollectible) {
        targetCollectible = bestCollectible;
        claimedTarget.current = bestCollectible.id;
        targetClaimTime.current = now;
      }
    }
    
    // Move toward target collectible
    const targetDistance = targetCollectible ? position.current.distanceTo(targetCollectible.position) : Infinity;
    if (targetCollectible && targetDistance < 15) {
      const direction = new THREE.Vector3()
        .subVectors(targetCollectible.position, position.current)
        .normalize();
      
      velocity.current.copy(direction).multiplyScalar(moveSpeed * delta);
      position.current.add(velocity.current);
      
      // Rotate to face target
      const targetRotation = Math.atan2(direction.x, direction.z);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        5 * delta
      );
      
      // "Catch" collectible if close enough
      if (targetDistance < 0.8 && targetCollectible.position.y < 1) {
        removeCollectible(targetCollectible.id);
        addBotCatch(id);
        claimedTarget.current = null; // Release claim after catching
        console.log(`Bot ${id} caught ${targetCollectible.type}!`);
      }
    } else {
      // Wander randomly if no target
      if (Math.random() < 0.01) {
        const randomDirection = new THREE.Vector3(
          Math.random() * 2 - 1,
          0,
          Math.random() * 2 - 1
        ).normalize();
        velocity.current.copy(randomDirection).multiplyScalar(moveSpeed * delta * 0.3);
        position.current.add(velocity.current);
      }
    }
    
    // Keep bot on street
    position.current.x = THREE.MathUtils.clamp(position.current.x, -6.5, 6.5);
    position.current.z = THREE.MathUtils.clamp(position.current.z, -15, 15);
    
    // Update mesh position
    meshRef.current.position.copy(position.current);
    
    // Update head position to follow body
    headRef.current.position.set(position.current.x, position.current.y + 0.5, position.current.z);
    
    // Update shadow position
    shadowRef.current.position.set(position.current.x, 0.01, position.current.z);
    
    // Bobbing animation
    const bobOffset = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    meshRef.current.position.y = 0.5 + bobOffset;
    headRef.current.position.y = 1.0 + bobOffset;
  });
  
  return (
    <group>
      {/* Bot character */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.4]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Bot head */}
      <mesh ref={headRef} castShadow>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Shadow */}
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
