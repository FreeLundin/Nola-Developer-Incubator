import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import * as THREE from "three";

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

export interface JoystickInput {
  x: number; // -1 to 1
  y: number; // -1 to 1
}

interface PlayerProps {
  position?: [number, number, number];
  onPositionChange?: (position: THREE.Vector3) => void;
  mouseTarget?: THREE.Vector3 | null;
  onClearMouseTarget?: () => void;
  joystickInput?: JoystickInput | null;
}

export function Player({ position = [0, 0.5, 0], onPositionChange, mouseTarget, onClearMouseTarget, joystickInput = null }: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const [, getKeys] = useKeyboardControls<Controls>();
  const playerSkin = useParadeGame((state) => state.playerSkin);
  
  const playerPosition = useRef(new THREE.Vector3(...position));
  const playerVelocity = useRef(new THREE.Vector3());
  const playerDirection = useRef(new THREE.Vector3());
  const currentMouseTarget = useRef<THREE.Vector3 | null>(null);
  const lastMoveTime = useRef<number | null>(null); // null until first movement
  const inactivityWarned = useRef(false);
  
  // Player settings (base values)
  const baseMoveSpeed = 5;
  const rotationSpeed = 3;
  const INACTIVITY_TIMEOUT = 30000; // 30 seconds in milliseconds
  
  // Map player skin to colors
  const skinColorMap = {
    default: "#9b59b6",
    golden: "#FFD700",
    rainbow: "#FF1493", // Use magenta as base, we'll add gradient effect
    ghost: "#E0E0E0",
    king: "#8B4513",
    jester: "#FF1493",
  };
  const playerHexColor = skinColorMap[playerSkin];
  
  useEffect(() => {
    console.log("Player initialized at position:", position);
  }, []);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const keys = getKeys();
    const speedMultiplier = useParadeGame.getState().getMoveSpeedMultiplier();
    const moveSpeed = baseMoveSpeed * speedMultiplier;
    
    // Update mouse target if changed
    if (mouseTarget !== currentMouseTarget.current) {
      currentMouseTarget.current = mouseTarget || null;
    }
    
    // Keyboard input
    let moveX = 0;
    let moveZ = 0;
    
    if (keys.forward) moveZ -= 1;
    if (keys.back) moveZ += 1;
    if (keys.left) moveX -= 1;
    if (keys.right) moveX += 1;
    
    // Joystick input (overrides keyboard if active)
    if (joystickInput && (joystickInput.x !== 0 || joystickInput.y !== 0)) {
      moveX = joystickInput.x;
      moveZ = joystickInput.y;
    }
    
    // Mouse click movement (only if no keyboard/touch/joystick input)
    const hasManualInput = moveX !== 0 || moveZ !== 0;
    if (!hasManualInput && currentMouseTarget.current) {
      const distanceToTarget = playerPosition.current.distanceTo(currentMouseTarget.current);
      
      // If close enough to target, clear it
      if (distanceToTarget < 0.5) {
        currentMouseTarget.current = null;
        if (onClearMouseTarget) {
          onClearMouseTarget();
        }
        console.log("Reached mouse target");
      } else {
        // Move toward mouse target
        const direction = new THREE.Vector3()
          .subVectors(currentMouseTarget.current, playerPosition.current)
          .normalize();
        
        moveX = direction.x;
        moveZ = direction.z;
      }
    }
    
    // Clear mouse target if manual input is detected
    if (hasManualInput && currentMouseTarget.current) {
      currentMouseTarget.current = null;
      if (onClearMouseTarget) {
        onClearMouseTarget();
      }
      console.log("Manual input detected, clearing mouse target");
    }
    
    // Update player direction and movement
    const isMoving = moveX !== 0 || moveZ !== 0;
    
    if (isMoving) {
      playerDirection.current.set(moveX, 0, moveZ).normalize();
      
      // Move player
      playerVelocity.current.copy(playerDirection.current).multiplyScalar(moveSpeed * delta);
      playerPosition.current.add(playerVelocity.current);
      
      // Rotate player to face movement direction
      const targetRotation = Math.atan2(moveX, moveZ);
      const currentRotation = meshRef.current.rotation.y;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        currentRotation,
        targetRotation,
        rotationSpeed * delta
      );
      
      // Update last move time when player moves (initialize on first movement)
      lastMoveTime.current = Date.now();
      inactivityWarned.current = false;
    }
    
    // Keep player on the street (constrain movement to street boundaries)
    playerPosition.current.x = THREE.MathUtils.clamp(playerPosition.current.x, -6.5, 6.5);
    playerPosition.current.z = THREE.MathUtils.clamp(playerPosition.current.z, -15, 15);
    
    // Update mesh position
    meshRef.current.position.copy(playerPosition.current);
    
    // Update shadow position efficiently
    if (shadowRef.current) {
      shadowRef.current.position.set(playerPosition.current.x, 0.01, playerPosition.current.z);
    }
    
    // Notify parent of position change
    if (onPositionChange) {
      onPositionChange(playerPosition.current);
    }
    
    // Check for inactivity timeout (only during playing phase and after first movement)
    const gamePhase = useParadeGame.getState().phase;
    if (gamePhase === "playing" && lastMoveTime.current !== null) {
      const timeSinceLastMove = Date.now() - lastMoveTime.current;
      
      if (timeSinceLastMove >= INACTIVITY_TIMEOUT) {
        if (!inactivityWarned.current) {
          inactivityWarned.current = true;
          useParadeGame.getState().endGameDueToInactivity();
        }
      }
    }
  });
  
  return (
    <group>
      {/* Player character - simple capsule shape with assigned color */}
      <mesh ref={meshRef} position={position} castShadow>
        {/* Body */}
        <capsuleGeometry args={[0.3, 1.0, 8, 16]} />
        <meshStandardMaterial color={playerHexColor} emissive={playerHexColor} emissiveIntensity={0.3} />
        
        {/* Crown accessory - positioned on top of player as a child so it moves with player */}
        <group position={[0, 0.7, 0]}>
          {/* Crown base */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.4, 0.2, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} emissive="#FFD700" emissiveIntensity={0.5} />
          </mesh>
          {/* Crown points */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * 0.35;
            const z = Math.sin(angle) * 0.35;
            return (
              <mesh key={i} position={[x, 0.15, z]} castShadow>
                <coneGeometry args={[0.08, 0.2, 4]} />
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} emissive="#FFD700" emissiveIntensity={0.5} />
              </mesh>
            );
          })}
          {/* Crown jewel */}
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#FF1493" metalness={1.0} roughness={0.1} emissive="#FF1493" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </mesh>
      
      {/* Player shadow indicator on ground - optimized with ref */}
      <mesh ref={shadowRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
