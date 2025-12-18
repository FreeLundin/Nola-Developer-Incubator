import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AggressiveNPCProps {
  id: string;
  position: [number, number, number];
  isChasing: boolean;
  playerPosition: THREE.Vector3;
  onHitPlayer: () => void;
  onPlayerHitNPC: () => void;
  chaseEndTime: number | null;
  onChaseEnd: () => void;
}

export function AggressiveNPC({
  id,
  position,
  isChasing,
  playerPosition,
  onHitPlayer,
  onPlayerHitNPC,
  chaseEndTime,
  onChaseEnd,
}: AggressiveNPCProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const npcPosition = useRef(new THREE.Vector3(...position));
  const wanderTarget = useRef(new THREE.Vector3(
    Math.random() * 13 - 6.5, // Random x between -6.5 and 6.5
    0.5,
    Math.random() * 30 - 15 // Random z between -15 and 15
  ));
  const wanderSpeed = 2; // Slower than regular bots
  const chaseSpeed = 3.5; // Still slower than player's base speed (5)
  const lastHitTime = useRef(0);
  const hitCooldown = 1000; // 1 second cooldown between hits
  const nextTargetTime = useRef(Date.now() + Math.random() * 3000 + 2000); // Change target every 2-5 seconds

  useEffect(() => {
    console.log(`🟥 AggressiveNPC ${id} spawned at (${position[0]}, ${position[2]})`);
  }, [id, position]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const now = Date.now();
    const distance = npcPosition.current.distanceTo(playerPosition);

    if (isChasing) {
      // Chase the player
      const direction = new THREE.Vector3()
        .subVectors(playerPosition, npcPosition.current)
        .normalize();

      npcPosition.current.x += direction.x * chaseSpeed * delta;
      npcPosition.current.z += direction.z * chaseSpeed * delta;

      // Constrain to street bounds
      npcPosition.current.x = THREE.MathUtils.clamp(npcPosition.current.x, -6.5, 6.5);
      npcPosition.current.z = THREE.MathUtils.clamp(npcPosition.current.z, -15, 15);

      // Check if chase time expired
      if (chaseEndTime && now >= chaseEndTime) {
        onChaseEnd();
      }

      // Check collision with player (NPC hits player while chasing)
      if (distance < 1.2 && now - lastHitTime.current > hitCooldown) {
        lastHitTime.current = now;
        onHitPlayer();
      }
    } else {
      // Wander behavior - move randomly around the catching area
      // Pick new random target periodically
      if (now >= nextTargetTime.current) {
        wanderTarget.current.set(
          Math.random() * 13 - 6.5, // Random x between -6.5 and 6.5
          0.5,
          Math.random() * 30 - 15 // Random z between -15 and 15
        );
        nextTargetTime.current = now + Math.random() * 3000 + 2000; // Next target in 2-5 seconds
      }
      
      // Move toward wander target
      const direction = new THREE.Vector3()
        .subVectors(wanderTarget.current, npcPosition.current)
        .normalize();
      
      npcPosition.current.x += direction.x * wanderSpeed * delta;
      npcPosition.current.z += direction.z * wanderSpeed * delta;
      
      // Constrain to catching area bounds
      npcPosition.current.x = THREE.MathUtils.clamp(npcPosition.current.x, -6.5, 6.5);
      npcPosition.current.z = THREE.MathUtils.clamp(npcPosition.current.z, -15, 15);
      
      // Check if player hits the NPC while it's wandering
      if (distance < 1.2 && now - lastHitTime.current > hitCooldown) {
        lastHitTime.current = now;
        onPlayerHitNPC();
      }
    }

    // Update mesh position
    meshRef.current.position.copy(npcPosition.current);

    // Rotate for visual effect
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x += delta * 0.3;
  });

  // Black and white checker pattern material
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  
  return (
    <group>
      <mesh ref={meshRef} position={position} geometry={geometry}>
        <meshStandardMaterial 
          color={isChasing ? "#ff0000" : "#ffffff"} 
          emissive={isChasing ? "#ff0000" : "#000000"}
          emissiveIntensity={isChasing ? 0.3 : 0}
        />
      </mesh>
      {/* Black accent edges */}
      <lineSegments position={[npcPosition.current.x, npcPosition.current.y, npcPosition.current.z]}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color="#000000" linewidth={2} />
      </lineSegments>
    </group>
  );
}
