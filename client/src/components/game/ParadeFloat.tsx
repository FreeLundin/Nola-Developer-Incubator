import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import * as THREE from "three";

interface ParadeFloatProps {
  id: string;
  startZ: number;
  lane: number; // -1 or 1 for left or right side of street
  color: string;
}

export function ParadeFloat({ 
  id, 
  startZ, 
  lane, 
  color,
}: ParadeFloatProps) {
  const meshRef = useRef<THREE.Group>(null);
  const position = useRef(new THREE.Vector3(lane * 5, 1, startZ));
  const lastThrowTime = useRef(Date.now());
  const { addCollectible, phase, getFloatSpeed, getThrowInterval } = useParadeGame();
  
  // Pre-calculate random decorative elements positions
  const decorations = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      x: (Math.random() - 0.5) * 1.5,
      y: Math.random() * 1.5 + 0.5,
      z: (Math.random() - 0.5) * 2,
      scale: Math.random() * 0.3 + 0.2,
    }));
  }, []);
  
  useEffect(() => {
    console.log(`Parade float ${id} initialized at lane ${lane}`);
  }, [id, lane]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || phase !== "playing") return;
    
    // Get dynamic speed based on level
    const floatSpeed = getFloatSpeed();
    const throwInterval = getThrowInterval();
    
    // Move float forward along the street
    position.current.z += floatSpeed * delta;
    
    // Reset float position when it goes too far
    if (position.current.z > 20) {
      position.current.z = -30;
      lastThrowTime.current = Date.now(); // Reset throw timer
    }
    
    meshRef.current.position.copy(position.current);
    
    // Gentle bobbing animation
    meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    
    // Gentle rotation animation
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    
    // Throw collectibles at intervals (faster at higher levels)
    const now = Date.now();
    if (now - lastThrowTime.current > throwInterval && position.current.z < 10 && position.current.z > -10) {
      throwCollectible();
      lastThrowTime.current = now;
    }
  });
  
  const throwCollectible = () => {
    // Determine what to throw - special items have lower chance
    const specialChance = Math.random();
    let randomType: "beads" | "doubloon" | "cup" | "king_cake" | "speed_boost" | "double_points";
    
    if (specialChance < 0.02) {
      // 2% chance for King Cake (very rare, worth 5 points)
      randomType = "king_cake";
    } else if (specialChance < 0.08) {
      // 6% chance for power-ups (3% each)
      randomType = Math.random() < 0.5 ? "speed_boost" : "double_points";
    } else {
      // 92% chance for regular collectibles
      const throwTypes = ["beads", "doubloon", "cup"] as const;
      randomType = throwTypes[Math.floor(Math.random() * throwTypes.length)];
    }
    
    // Vary throw arc heights for different difficulty levels
    // 40% low arc (easy to catch), 40% medium arc, 20% high arc
    const arcRoll = Math.random();
    let upwardArc: number;
    
    if (arcRoll < 0.4) {
      // Low arc - easier to catch (released earlier)
      upwardArc = Math.random() * 0.2 + 0.4; // 0.4 to 0.6
    } else if (arcRoll < 0.8) {
      // Medium arc
      upwardArc = Math.random() * 0.2 + 0.6; // 0.6 to 0.8
    } else {
      // High arc - harder to catch
      upwardArc = Math.random() * 0.3 + 0.8; // 0.8 to 1.1
    }
    
    // Create a collectible thrown from the float - most go OVER center line
    // 80% of throws go over center line (negative Z direction from float's perspective)
    const crossCenterLine = Math.random() < 0.8;
    
    const throwDirection = new THREE.Vector3(
      -lane * (Math.random() * 0.5 + 0.5), // Toward center with some randomness
      upwardArc, // Variable upward arc
      crossCenterLine ? -(Math.random() * 0.6 + 0.4) : Math.random() * 0.4 - 0.2 // Most go backward (over center)
    ).normalize();
    
    const throwForce = 6.5;
    
    const collectible = {
      id: `${id}-${Date.now()}-${Math.random()}`,
      position: position.current.clone(),
      velocity: throwDirection.multiplyScalar(throwForce),
      active: true,
      type: randomType,
    };
    
    addCollectible(collectible);
    console.log(`Float ${id} threw ${randomType}`);
  };
  
  return (
    <group ref={meshRef} position={[position.current.x, position.current.y, position.current.z]} scale={[1.5, 1.5, 1.5]}>
      {/* Main float platform - larger scale */}
      <mesh castShadow>
        <boxGeometry args={[2, 1.5, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Decorative elements on the float - optimized */}
      {decorations.map((dec, i) => (
        <mesh key={i} position={[dec.x, dec.y, dec.z]} castShadow>
          <sphereGeometry args={[dec.scale, 6, 6]} />
          <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Float wheels - optimized */}
      <mesh position={[-0.8, -0.7, -1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 8]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[0.8, -0.7, -1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 8]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[-0.8, -0.7, 1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 8]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[0.8, -0.7, 1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 8]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
    </group>
  );
}
