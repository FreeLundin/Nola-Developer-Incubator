import {useEffect, useMemo, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {useParadeGame} from "@/lib/stores/useParadeGame";
import {Html} from '@react-three/drei';
import * as THREE from "three";

interface ParadeFloatProps {
  id: string;
  startZ: number;
  lane: number; // -1 or 1 for left or right side of street
  color: string;
  label?: number; // optional numeric label to show on the float
  labelEnabled?: boolean;
  playerPosition?: THREE.Vector3;
}

export function ParadeFloat({ 
  id, 
  startZ, 
  lane, 
  color,
  label,
  labelEnabled = true,
  playerPosition,
}: ParadeFloatProps) {
  const meshRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const position = useRef(new THREE.Vector3(lane * 5, 1, startZ));
  const lastThrowTime = useRef(Date.now());
  const hasPassed = useRef(false);
  const { addCollectible, phase, getFloatSpeed, getThrowInterval, markFloatPassed } = useParadeGame();
  
  // Pre-calculate random decorative elements positions
  const decorations = useMemo(() => {
    return Array.from({ length: 5 }, () => ({
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
    
    // Mark as passed when it goes beyond the player (no more looping)
    if (position.current.z > 20 && !hasPassed.current) {
      hasPassed.current = true;
      markFloatPassed();
      console.log(`Float ${id} has passed!`);
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
    
    // Update label visibility, opacity and scale based on player distance
    try {
      if (labelRef.current && typeof label === 'number' && playerPosition) {
        const distance = position.current.distanceTo(playerPosition);
        const maxDistance = 20; // only show labels within this distance
        const visible = labelEnabled && distance <= maxDistance;
        if (!visible) {
          labelRef.current.style.display = 'none';
        } else {
          // Fade/scale by distance (closer = larger and more opaque)
          const t = Math.max(0, Math.min(1, 1 - distance / maxDistance)); // 1 at 0, 0 at maxDistance
          const opacity = Math.max(0, t);
          const scale = 0.6 + 0.4 * t; // between 0.6 and 1.0
          labelRef.current.style.display = 'block';
          labelRef.current.style.opacity = String(opacity);
          labelRef.current.style.transform = `scale(${scale})`;
        }
      } else if (labelRef.current) {
        // No playerPosition or label disabled -> hide
        labelRef.current.style.display = 'none';
      }
    } catch (e) { /* ignore DOM update errors */ }
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
    
    // Decide if this is a targeted throw (30% chance) or random throw
    const isTargetedThrow = playerPosition && Math.random() < 0.3;
    
    let throwDirection: THREE.Vector3;
    let throwForce: number;
    
    if (isTargetedThrow && playerPosition) {
      // Throw directly at player position with some leading
      const targetPos = playerPosition.clone();
      const direction = targetPos.sub(position.current).normalize();
      
      // Add upward arc for trajectory
      direction.y = Math.random() * 0.3 + 0.5; // 0.5 to 0.8 upward
      throwDirection = direction.normalize();
      
      // Stronger throw for targeted throws
      throwForce = Math.random() * 2 + 9; // 9-11 force
      console.log(`Float ${id} targeting player with force ${throwForce.toFixed(1)}`);
    } else {
      // Random throw with varied difficulty
      // Vary throw arc heights and distances
      const difficultyRoll = Math.random();
      let upwardArc: number;
      let baseForce: number;
      
      if (difficultyRoll < 0.3) {
        // Easy throws - low arc, moderate speed
        upwardArc = Math.random() * 0.15 + 0.35; // 0.35 to 0.5
        baseForce = Math.random() * 1.5 + 7; // 7-8.5 force
      } else if (difficultyRoll < 0.7) {
        // Medium throws - medium arc, higher speed
        upwardArc = Math.random() * 0.2 + 0.5; // 0.5 to 0.7
        baseForce = Math.random() * 2 + 8.5; // 8.5-10.5 force
      } else {
        // Hard throws - high arc or very fast
        upwardArc = Math.random() * 0.3 + 0.7; // 0.7 to 1.0
        baseForce = Math.random() * 2.5 + 10; // 10-12.5 force
      }
      
      // Determine throw depth - some go into dense obstacle area
      const throwDepthRoll = Math.random();
      let zDirection: number;
      
      if (throwDepthRoll < 0.25) {
        // 25% go deep into obstacle zone (Z: -16 to -19 area)
        zDirection = -(Math.random() * 0.5 + 1.2); // Strong backward throw
      } else if (throwDepthRoll < 0.75) {
        // 50% go to catchable area (normal)
        zDirection = -(Math.random() * 0.7 + 0.5); // Moderate backward
      } else {
        // 25% go short or forward
        zDirection = Math.random() * 0.5 - 0.2; // Short/forward throw
      }
      
      throwDirection = new THREE.Vector3(
        -lane * (Math.random() * 0.6 + 0.6), // Toward center/opposite side
        upwardArc, // Variable upward arc
        zDirection // Varied depth including obstacle zone
      ).normalize();
      
      throwForce = baseForce;
    }
    
    // Occasionally throw multiple items (clusters) to increase item density
    const clusterRoll = Math.random();
    const clusterCount = clusterRoll < 0.08 ? 3 : clusterRoll < 0.28 ? 2 : 1; // 8% triple, 20% double, rest single

    for (let k = 0; k < clusterCount; k++) {
      const spread = new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.6
      );
      const idSuffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const collectible = {
        id: `${id}-${idSuffix}-${k}`,
        position: position.current.clone().add(spread),
        velocity: throwDirection.clone().add(spread.clone().multiplyScalar(0.2)).multiplyScalar(throwForce),
        active: true,
        type: randomType,
      };

      addCollectible(collectible);
    }
    console.log(`Float ${id} threw ${clusterCount}x ${randomType}`);
  };
  
  // Refs for instanced meshes
  const wheelsRef = useRef<THREE.InstancedMesh | null>(null);

  useFrame(() => {
    // Update wheel instance matrices (4 wheels)
    if (wheelsRef.current) {
      const wheelPositions = [[-0.8, -0.7, -1], [0.8, -0.7, -1], [-0.8, -0.7, 1], [0.8, -0.7, 1]];
      for (let i = 0; i < 4; i++) {
        const pos = new THREE.Vector3(wheelPositions[i][0], wheelPositions[i][1] + meshRef.current!.position.y - 1, wheelPositions[i][2]);
        const m = new THREE.Matrix4();
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
        const s = new THREE.Vector3(1,1,1);
        m.compose(pos, q, s);
        wheelsRef.current.setMatrixAt(i, m);
      }
      wheelsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={meshRef} position={[position.current.x, position.current.y, position.current.z]} scale={[1.5, 1.5, 1.5]}>
      {/* Main float platform with enhanced emissive glow */}
      <mesh castShadow>
        <boxGeometry args={[2, 1.5, 3]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Numeric label integrated into UX */}
      {typeof label === 'number' && (
        <Html position={[0, 0.6, -1.6]} center style={{ pointerEvents: 'none' }}>
          <div ref={labelRef} style={{
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '6px 8px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
            transition: 'opacity 150ms linear, transform 150ms ease'
          }}>
            {label}
          </div>
        </Html>
      )}
      
      {/* Decorations are now rendered globally by FloatDecorationsInstanced to reduce draw calls */}
      {/* Float wheels - instanced (4 instances) */}
      <instancedMesh ref={wheelsRef} args={[new THREE.CylinderGeometry(0.3, 0.3, 0.3, 8), new THREE.MeshStandardMaterial({ color: '#2c2c2c' }), 4]} castShadow />
    </group>
  );
}
