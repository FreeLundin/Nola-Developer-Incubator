import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useParadeGame, type Collectible as CollectibleType } from "@/lib/stores/useParadeGame";
import { TrajectoryHint } from "./TrajectoryHint";
import { GlowingTrail } from "./GlowingTrail";
import * as THREE from "three";

interface CollectibleProps {
  collectible: CollectibleType;
  playerPosition: THREE.Vector3;
  onCatch: (type: CollectibleType["type"]) => void;
}

const COLLECTIBLE_COLORS = {
  beads: "#9b59b6",
  doubloon: "#f1c40f",
  cup: "#e74c3c",
  king_cake: "#ff6b35",
  speed_boost: "#00ffff",
  double_points: "#ffd700",
};

const GRAVITY = -15;
const CATCH_RADIUS = 1.5;
const GROUND_LEVEL = 0.5;
const MIN_CATCH_HEIGHT = 0.5;

export function Collectible({ collectible, playerPosition, onCatch }: CollectibleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useRef(collectible.position.clone());
  const velocity = useRef(collectible.velocity.clone());
  const { updateCollectible, removeCollectible, incrementMisses } = useParadeGame();
  const hasBeenCaught = useRef(false);
  const [showHint, setShowHint] = useState(true);
  const [timeOnGround, setTimeOnGround] = useState(0);
  const onGroundStartTime = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (!hasBeenCaught.current) {
        removeCollectible(collectible.id);
      }
    };
  }, [collectible.id]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || hasBeenCaught.current) return;

    // Get helper bot count
    const { updateCollectible, removeCollectible, incrementMisses } = useParadeGame();
    const helperBots = useParadeGame.getState().helperBots || 0;

    // Apply gravity
    velocity.current.y += GRAVITY * delta;

    // Helper bot attraction: if helperBots active, apply attraction force toward player
    if (helperBots > 0) {
      const attractRadius = 6 + helperBots * 2; // radius grows with number of helper bots
      const toPlayer = new THREE.Vector3().subVectors(playerPosition, position.current);
      const distance = toPlayer.length();
      if (distance < attractRadius) {
        // Normalize and apply attraction proportional to (1 - distance/attractRadius)
        const strength = 4 * (helperBots) * Math.max(0, 1 - distance / attractRadius);
        const accel = toPlayer.normalize().multiplyScalar(strength * delta);
        // Apply to velocity, clamp to avoid too fast
        velocity.current.add(accel);
        const maxSpeed = 8;
        if (velocity.current.length() > maxSpeed) {
          velocity.current.setLength(maxSpeed);
        }
      }
    }
    
    // Update position based on velocity
    position.current.add(velocity.current.clone().multiplyScalar(delta));
    
    // Check if on ground (with bouncing)
    const isOnGround = position.current.y <= 0.3;
    if (isOnGround) {
      position.current.y = 0.3;
      
      // Hide trajectory hint once landed
      if (showHint) setShowHint(false);
      
      // Start ground timer if not already started
      if (onGroundStartTime.current === null) {
        onGroundStartTime.current = Date.now();
      }
      
      // Check if been on ground for 5 seconds
      const timeOnGroundMs = Date.now() - onGroundStartTime.current;
      if (timeOnGroundMs > 5000) {
        // Count as a missed throw (not power-ups though)
        const isRegularItem = collectible.type === "beads" || collectible.type === "doubloon" || collectible.type === "cup" || collectible.type === "king_cake";
        if (isRegularItem) {
          incrementMisses();
        }
        removeCollectible(collectible.id);
        return;
      }
      
      // Bounce with energy loss
      if (Math.abs(velocity.current.y) > 0.5) {
        velocity.current.y = -velocity.current.y * 0.4; // Bounce with 40% energy
      } else {
        velocity.current.y = 0; // Stop bouncing if too slow
      }
      
      velocity.current.x *= 0.9; // Friction
      velocity.current.z *= 0.9;
    } else {
      // Reset ground timer if in air
      onGroundStartTime.current = null;
    }
    
    // Update mesh position
    meshRef.current.position.copy(position.current);
    
    // Update store with current position/velocity for competitor bots
    updateCollectible(collectible.id, { 
      position: position.current.clone(), 
      velocity: velocity.current.clone() 
    });
    
    // Rotation animation
    meshRef.current.rotation.x += delta * 2;
    meshRef.current.rotation.y += delta * 3;
    
    // Check if player is close enough to catch
    const distanceToPlayer = position.current.distanceTo(playerPosition);
    const isAboveGround = position.current.y >= MIN_CATCH_HEIGHT;
    const isInRange = distanceToPlayer < CATCH_RADIUS;
    const isCatchable = isInRange && isAboveGround && position.current.y < 2;
    
    // Highlight if catchable
    if (isCatchable && !hasBeenCaught.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 10) * 0.2);
      
      // Auto-catch when player is close
      if (distanceToPlayer < 0.8) {
        hasBeenCaught.current = true;
        onCatch(collectible.type);
        removeCollectible(collectible.id);
      }
    } else {
      meshRef.current.scale.setScalar(1);
    }
    
    // Remove if too far away or out of bounds
    if (position.current.y < -5 || Math.abs(position.current.x) > 20 || Math.abs(position.current.z) > 25) {
      removeCollectible(collectible.id);
    }
  });
  
  const color = COLLECTIBLE_COLORS[collectible.type];
  const size = collectible.type === "cup" ? 0.3 : 0.25;
  
  return (
    <group>
      {/* Trajectory hint - shows where item will land */}
      {showHint && position.current.y > GROUND_LEVEL && (
        <TrajectoryHint 
          initialPosition={position.current}
          initialVelocity={velocity.current}
          color={color}
        />
      )}
      
      <mesh ref={meshRef} castShadow>
        {collectible.type === "cup" ? (
          <cylinderGeometry args={[size, size * 0.8, size * 1.2, 6]} />
        ) : (
          <sphereGeometry args={[size, 8, 8]} />
        )}
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glowing trail effect when falling */}
      {position.current.y > GROUND_LEVEL && (
        <GlowingTrail targetRef={meshRef} color={color} length={6} />
      )}
      
      {/* Catchable highlight ring - optimized */}
      <mesh position={[position.current.x, 0.05, position.current.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[CATCH_RADIUS * 0.8, CATCH_RADIUS, 16]} />
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
