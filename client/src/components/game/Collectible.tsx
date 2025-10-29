import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useParadeGame, type Collectible as CollectibleType } from "@/lib/stores/useParadeGame";
import { TrajectoryHint } from "./TrajectoryHint";
import * as THREE from "three";

interface CollectibleProps {
  collectible: CollectibleType;
  playerPosition: THREE.Vector3;
  onCatch: (type: CollectibleType["type"]) => void;
  catchAction: number;
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

export function Collectible({ collectible, playerPosition, onCatch, catchAction }: CollectibleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useRef(collectible.position.clone());
  const velocity = useRef(collectible.velocity.clone());
  const { updateCollectible, removeCollectible } = useParadeGame();
  const hasBeenCaught = useRef(false);
  const previousCatchAction = useRef(catchAction);
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
    
    // Apply gravity
    velocity.current.y += GRAVITY * delta;
    
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
      
      // Auto-catch if very close (for PC)
      if (distanceToPlayer < 0.8) {
        hasBeenCaught.current = true;
        onCatch(collectible.type);
        removeCollectible(collectible.id);
      }
      
      // Manual catch via button press (for tablets)
      if (catchAction !== previousCatchAction.current) {
        previousCatchAction.current = catchAction;
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
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      
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
