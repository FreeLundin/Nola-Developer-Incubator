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
  const patrolDirection = useRef(Math.random() > 0.5 ? 1 : -1);
  const patrolSpeed = 2; // Slower than regular bots
  const chaseSpeed = 3.5; // Still slower than player's base speed (5)
  const lastHitTime = useRef(0);
  const hitCooldown = 1000; // 1 second cooldown between hits

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
      // Patrol behavior - move back and forth on the street
      npcPosition.current.x += patrolDirection.current * patrolSpeed * delta;

      // Bounce at street boundaries
      if (npcPosition.current.x > 6.5 || npcPosition.current.x < -6.5) {
        patrolDirection.current *= -1;
        npcPosition.current.x = THREE.MathUtils.clamp(npcPosition.current.x, -6.5, 6.5);
      }
      
      // Check if player hits the NPC while it's patrolling
      if (distance < 1.2 && now - lastHitTime.current > hitCooldown) {
        lastHitTime.current = now;
        onPlayerHitNPC();
      }
    }

    // Update mesh position
    meshRef.current.position.copy(npcPosition.current);

    // Rotate cube for visual effect
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
