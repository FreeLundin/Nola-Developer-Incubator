import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ObstacleProps {
  id: string;
  startPosition: [number, number, number];
  type: "trash" | "barrier";
  playerPosition: THREE.Vector3;
  onCollision: () => void;
}

const OBSTACLE_RADIUS = 0.6;
const COLLISION_DISTANCE = 0.8;

export function Obstacle({ id, startPosition, type, playerPosition, onCollision }: ObstacleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const hasCollided = useRef(false);
  const position = useRef(new THREE.Vector3(...startPosition));
  
  // Random movement speed and direction for each obstacle (mutable direction)
  const moveSpeed = useMemo(() => Math.random() * 1.5 + 1.5, []); // 1.5 to 3
  const moveDirection = useRef((Math.random() > 0.5 ? 1 : -1)); // Left or right
  
  useFrame((state, delta) => {
    if (!meshRef.current || !shadowRef.current) return;
    
    // Move obstacle left-right across the street
    position.current.x += moveDirection.current * moveSpeed * delta;
    
    // Reverse direction when hitting street boundaries
    if (position.current.x > 6 || position.current.x < -6) {
      position.current.x = THREE.MathUtils.clamp(position.current.x, -6, 6);
      moveDirection.current *= -1; // Bounce back
    }
    
    // Update mesh position
    meshRef.current.position.copy(position.current);
    shadowRef.current.position.set(position.current.x, 0.01, position.current.z);
    
    // Simple rotation animation for trash
    if (type === "trash") {
      meshRef.current.rotation.y += 0.02;
    }
    
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
  
  const color = type === "trash" ? "#4a4a4a" : "#ff4444";
  const size = type === "trash" ? 0.5 : 0.4;
  
  return (
    <group>
      <mesh ref={meshRef} castShadow>
        {type === "trash" ? (
          <boxGeometry args={[size, size, size]} />
        ) : (
          <cylinderGeometry args={[size, size, 0.8, 6]} />
        )}
        <meshStandardMaterial 
          color={color}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Ground shadow */}
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[size * 1.2, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
