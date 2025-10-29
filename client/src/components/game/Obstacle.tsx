import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ObstacleProps {
  id: string;
  startPosition: [number, number, number];
  playerPosition: THREE.Vector3;
  onCollision: () => void;
}

const OBSTACLE_RADIUS = 0.6;
const COLLISION_DISTANCE = 0.8;

export function Obstacle({ id, startPosition, playerPosition, onCollision }: ObstacleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const hasCollided = useRef(false);
  const position = useRef(new THREE.Vector3(...startPosition));
  
  // Random wandering behavior
  const wanderTarget = useRef(new THREE.Vector3(
    Math.random() * 13 - 6.5, // Random x between -6.5 and 6.5
    0.5,
    Math.random() * 30 - 15 // Random z between -15 and 15
  ));
  const moveSpeed = useMemo(() => Math.random() * 1.5 + 1.5, []); // 1.5 to 3
  const nextTargetTime = useRef(Date.now() + Math.random() * 3000 + 2000); // Change target every 2-5 seconds
  
  useFrame((state, delta) => {
    if (!meshRef.current || !shadowRef.current) return;
    
    const now = Date.now();
    
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
      .subVectors(wanderTarget.current, position.current)
      .normalize();
    
    position.current.x += direction.x * moveSpeed * delta;
    position.current.z += direction.z * moveSpeed * delta;
    
    // Constrain to catching area bounds
    position.current.x = THREE.MathUtils.clamp(position.current.x, -6.5, 6.5);
    position.current.z = THREE.MathUtils.clamp(position.current.z, -15, 15);
    
    // Update mesh position
    meshRef.current.position.copy(position.current);
    shadowRef.current.position.set(position.current.x, 0.01, position.current.z);
    
    // Check collision with player
    if (!hasCollided.current) {
      const distance = position.current.distanceTo(playerPosition);
      if (distance < COLLISION_DISTANCE) {
        hasCollided.current = true;
        onCollision();
        console.log(`Player hit obstacle ${id}!`);
      }
    }
    
    // Reset collision flag if player moves away
    if (hasCollided.current) {
      const distance = position.current.distanceTo(playerPosition);
      if (distance > COLLISION_DISTANCE * 2) {
        hasCollided.current = false;
      }
    }
  });
  
  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[OBSTACLE_RADIUS, 8, 8]} />
        <meshStandardMaterial 
          color="#ff6b6b"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Ground shadow */}
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[OBSTACLE_RADIUS * 1.2, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
