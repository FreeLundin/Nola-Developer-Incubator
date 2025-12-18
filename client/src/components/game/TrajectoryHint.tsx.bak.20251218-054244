import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TrajectoryHintProps {
  initialPosition: THREE.Vector3;
  initialVelocity: THREE.Vector3;
  color: string;
}

const GRAVITY = -15;
const GROUND_LEVEL = 0.3;

export function TrajectoryHint({ initialPosition, initialVelocity, color }: TrajectoryHintProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Calculate landing position using projectile motion physics
  const landingPosition = useMemo(() => {
    // Solve for time when y = GROUND_LEVEL
    // y = y0 + vy*t + 0.5*g*t^2
    // GROUND_LEVEL = y0 + vy*t + 0.5*g*t^2
    // 0.5*g*t^2 + vy*t + (y0 - GROUND_LEVEL) = 0
    
    const a = 0.5 * GRAVITY;
    const b = initialVelocity.y;
    const c = initialPosition.y - GROUND_LEVEL;
    
    // Quadratic formula: t = (-b ± sqrt(b^2 - 4ac)) / 2a
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) {
      // No solution, item won't reach ground (shouldn't happen)
      return new THREE.Vector3(initialPosition.x, GROUND_LEVEL, initialPosition.z);
    }
    
    // Take the positive time value
    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t = Math.max(t1, t2);
    
    // Calculate x and z positions at that time
    const landingX = initialPosition.x + initialVelocity.x * t;
    const landingZ = initialPosition.z + initialVelocity.z * t;
    
    return new THREE.Vector3(landingX, GROUND_LEVEL + 0.01, landingZ);
  }, [initialPosition, initialVelocity]);
  
  // Pulse animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.15 + 1;
    meshRef.current.scale.setScalar(pulse);
  });
  
  return (
    <group position={landingPosition}>
      {/* Landing target circle */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.6, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Center dot */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 8]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.9, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
