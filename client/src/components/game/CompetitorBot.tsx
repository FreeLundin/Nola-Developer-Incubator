import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import * as THREE from "three";

interface CompetitorBotProps {
  id: string;
  startX: number;
  color: string;
}

export function CompetitorBot({ id, startX, color }: CompetitorBotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const position = useRef(new THREE.Vector3(startX, 0.5, Math.random() * 10 - 5));
  const velocity = useRef(new THREE.Vector3());
  const { collectibles, removeCollectible, phase } = useParadeGame();
  
  const moveSpeed = useMemo(() => Math.random() * 1.5 + 2, []); // Varying speeds
  
  useEffect(() => {
    console.log(`Competitor bot ${id} spawned at x:${startX}`);
  }, [id, startX]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || !headRef.current || !shadowRef.current || phase !== "playing") return;
    
    // Find nearest collectible that's on ground or low enough
    let nearestCollectible: typeof collectibles[0] | null = null;
    let nearestDistance = Infinity;
    
    for (const collectible of collectibles) {
      // Only chase items that are low enough or on ground
      if (collectible.position.y < 1.5) {
        const distance = position.current.distanceTo(collectible.position);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestCollectible = collectible;
        }
      }
    }
    
    // Move toward nearest collectible
    if (nearestCollectible && nearestDistance < 15) {
      const direction = new THREE.Vector3()
        .subVectors(nearestCollectible.position, position.current)
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
      if (nearestDistance < 0.8 && nearestCollectible.position.y < 1) {
        removeCollectible(nearestCollectible.id);
        console.log(`Bot ${id} caught ${nearestCollectible.type}!`);
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
