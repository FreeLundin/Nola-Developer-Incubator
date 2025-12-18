import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useBotsConfig } from "@/lib/hooks/useBotsConfig";
import * as THREE from "three";

interface CompetitorBotProps {
  id: string;
  name?: string; // Human-friendly display name
  persona?: 'aggressive' | 'focused' | 'playful' | 'sneaky' | 'lucky' | 'steady';
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

export function CompetitorBot({ id, name, persona = 'steady', startX, startZ, color }: CompetitorBotProps) {
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
  
  // Persona-driven behavior modifiers
  const personaSettings = useMemo(() => {
    switch (persona) {
      case 'aggressive':
        return { speedBase: 4.0, risk: 0.9, preferenceBoost: 1.5, danceChance: 0.01 };
      case 'focused':
        return { speedBase: 3.2, risk: 0.6, preferenceBoost: 1.8, danceChance: 0.005 };
      case 'playful':
        return { speedBase: 3.0, risk: 0.5, preferenceBoost: 1.2, danceChance: 0.08 };
      case 'sneaky':
        return { speedBase: 3.6, risk: 0.7, preferenceBoost: 1.3, danceChance: 0.02 };
      case 'lucky':
        return { speedBase: 3.1, risk: 0.4, preferenceBoost: 2.0, danceChance: 0.06 };
      default:
        return { speedBase: 2.8, risk: 0.5, preferenceBoost: 1.0, danceChance: 0.02 };
    }
  }, [persona]);
  
  const moveSpeed = useMemo(() => personaSettings.speedBase + (Math.random() * 0.8 - 0.4), [personaSettings]);
  const currentTarget = useRef<string | null>(null); // Currently targeting collectible ID
  
  // Reactive display name: prefer runtime config override, then prop name, then id
  const { bots: runtimeBots } = useBotsConfig();
  const runtimeMeta = runtimeBots.find((b: any) => b.id === id);
  const displayName = runtimeMeta?.name || name || id;
  
  useEffect(() => {
    console.log(`Competitor ${displayName} (${persona}) spawned at (${startX.toFixed(1)}, ${startZ.toFixed(1)})`);
  }, [displayName, persona, startX, startZ]);
  
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
          
          // Score based on distance, persona preference and unique bot-collectible preference
          const distanceScore = 20 - distance; // Closer = higher score
          // Persona increases desire for certain items
          const personaMultiplier = personaSettings.preferenceBoost || 1.0;
          
          // Use hash of (botId + collectibleId) for unique per-pair preference
          const preferenceBonus = hashBotCollectible(id, collectible.id) * (personaMultiplier);
          
          // Slight bias toward lower-y items for "lucky" and "playful" bots
          const heightBonus = (collectible.position.y < 0.8) ? (persona === 'lucky' ? 3 : (persona === 'playful' ? 1.5 : 0)) : 0;
          
          const totalScore = distanceScore + preferenceBonus + heightBonus;
          
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
      
      // Risky/aggressive bots take faster/smaller-turn approaches
      const speedFactor = moveSpeed * (personaSettings.risk || 0.6);
      velocity.current.copy(direction).multiplyScalar(speedFactor * delta);
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
        console.log(`${displayName} (${persona}) caught ${targetCollectible.type}!`);
      }
    } else {
      // Idle/dance behavior based on persona when no target
      if (Math.random() < personaSettings.danceChance) {
        const wiggle = new THREE.Vector3(
          (Math.random() * 2 - 1) * 0.2,
          0,
          (Math.random() * 2 - 1) * 0.2
        );
        velocity.current.copy(wiggle).multiplyScalar(delta * 0.5);
        position.current.add(velocity.current);
      } else if (Math.random() < 0.01) {
        const randomDirection = new THREE.Vector3(
          Math.random() * 2 - 1,
          0,
          Math.random() * 2 - 1
        ).normalize();
        velocity.current.copy(randomDirection).multiplyScalar(moveSpeed * delta * 0.2);
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
