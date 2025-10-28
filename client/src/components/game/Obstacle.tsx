import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ObstacleProps {
  id: string;
  position: [number, number, number];
  type: "trash" | "barrier";
  onCollision: () => void;
}

const OBSTACLE_RADIUS = 0.6;

export function Obstacle({ id, position, type, onCollision }: ObstacleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hasCollided = useRef(false);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Simple rotation animation for trash
    if (type === "trash") {
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  const color = type === "trash" ? "#4a4a4a" : "#ff4444";
  const size = type === "trash" ? 0.5 : 0.4;
  
  return (
    <group position={position}>
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
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[size * 1.2, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
