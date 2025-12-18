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

// Simple hash function for consistent bot-collectible preferences
function hashBotCollectible(botId: string, collectibleId: string): number {
  let hash = 0;
  const combined = botId + collectibleId;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash % 100) / 10; // Return value between 0-10
}

export function CompetitorBot({ id, startX, startZ, color }: CompetitorBotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const position = useRef(new THREE.Vector3(startX, 0.5, startZ)); // Start at assigned position
  const velocity = useRef(new THREE.Vector3());
  const { 
    collectibles, 
    removeCollectible, 
    addBotCatch, 
    phase,
    claimCollectible,
    releaseCollectibleClaim,
    getCollectibleClaim,
  } = useParadeGame();
  
  const moveSpeed = useMemo(() => Math.random() * 1.5 + 2.5, []); // Varying speeds (2.5-4)
  const currentTarget = useRef<string | null>(null); // Currently targeting collectible ID
  
  useEffect(() => {
    console.log(`Competitor bot ${id} spawned at (${startX.toFixed(1)}, ${startZ.toFixed(1)})`);
  }, [id, startX, startZ]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || !headRef.current || !shadowRef.current || phase !== "playing") return;
    
    // Check if we still have a valid target
    let targetCollectible: typeof collectibles[0] | null = null;
    
    if (currentTarget.current) {
      // Try to find our current target
      const foundTarget = collectibles.find(c => c.id === currentTarget.current);
      
      // Check if it's still valid (exists, low enough, and still ours)
      if (foundTarget && foundTarget.position.y < 1.5) {
        const claim = getCollectibleClaim(foundTarget.id);
        if (claim && claim.botId === id) {
          targetCollectible = foundTarget;
        } else {
          // Lost claim, release it
          currentTarget.current = null;
        }
      } else {
        // Target is gone or too high, release it
        if (currentTarget.current) {
          releaseCollectibleClaim(currentTarget.current);
        }
        currentTarget.current = null;
      }
    }
    
    // If we don't have a valid target, find a new one
    if (!targetCollectible) {
      let bestCollectible: typeof collectibles[0] | null = null;
      let bestScore = -Infinity;
      const now = Date.now();
      
      for (const collectible of collectibles) {
        // Only consider items that are low enough or on ground
        if (collectible.position.y < 1.5) {
          // Check existing claim - allow reclaiming if stale (>2s old)
          const existingClaim = getCollectibleClaim(collectible.id);
          const claimAge = existingClaim ? (now - existingClaim.claimTime) : Infinity;
          
          // Skip only if claimed by another bot AND claim is fresh (<2s)
          if (existingClaim && existingClaim.botId !== id && claimAge < 2000) {
            continue; // Skip fresh claims by other bots
          }
          
          const distance = position.current.distanceTo(collectible.position);
          
          // Score based on distance and unique bot-collectible preference
          const distanceScore = 20 - distance; // Closer = higher score
          
          // Use hash of (botId + collectibleId) for unique per-pair preference
          const preferenceBonus = hashBotCollectible(id, collectible.id);
          
          const totalScore = distanceScore + preferenceBonus;
          
          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestCollectible = collectible;
          }
        }
      }
      
      // Try to claim the new target
      if (bestCollectible) {
        const claimed = claimCollectible(bestCollectible.id, id);
        if (claimed) {
          targetCollectible = bestCollectible;
          currentTarget.current = bestCollectible.id;
        }
      }
    }
    
    // Move toward target collectible (always pursue if we have one claimed)
    if (targetCollectible) {
      const targetDistance = position.current.distanceTo(targetCollectible.position);
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
        currentTarget.current = null; // Release target after catching
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
