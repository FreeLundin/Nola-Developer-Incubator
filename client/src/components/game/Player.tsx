import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { TouchInput } from "./TouchControls";
import * as THREE from "three";

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

interface PlayerProps {
  position?: [number, number, number];
  onPositionChange?: (position: THREE.Vector3) => void;
  touchInput?: TouchInput;
  mouseTarget?: THREE.Vector3 | null;
  onClearMouseTarget?: () => void;
}

export function Player({ position = [0, 0.5, 0], onPositionChange, touchInput, mouseTarget, onClearMouseTarget }: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const [, getKeys] = useKeyboardControls<Controls>();
  
  const playerPosition = useRef(new THREE.Vector3(...position));
  const playerVelocity = useRef(new THREE.Vector3());
  const playerDirection = useRef(new THREE.Vector3());
  const currentMouseTarget = useRef<THREE.Vector3 | null>(null);
  
  // Player settings (base values)
  const baseMoveSpeed = 5;
  const rotationSpeed = 3;
  
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
    
    // Combine keyboard and touch input
    let moveX = 0;
    let moveZ = 0;
    
    // Keyboard input
    if (keys.forward) moveZ -= 1;
    if (keys.back) moveZ += 1;
    if (keys.left) moveX -= 1;
    if (keys.right) moveX += 1;
    
    // Touch input (if available)
    if (touchInput && (Math.abs(touchInput.x) > 0.1 || Math.abs(touchInput.y) > 0.1)) {
      moveX += touchInput.x;
      moveZ += touchInput.y;
    }
    
    // Mouse click movement (only if no keyboard/touch input)
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
    if (moveX !== 0 || moveZ !== 0) {
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
    }
    
    // Keep player on the street (constrain movement)
    playerPosition.current.x = THREE.MathUtils.clamp(playerPosition.current.x, -8, 8);
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
  });
  
  return (
    <group>
      {/* Player character - simple capsule shape */}
      <mesh ref={meshRef} position={position} castShadow>
        {/* Body */}
        <capsuleGeometry args={[0.3, 1.0, 8, 16]} />
        <meshStandardMaterial color="#ff6b35" />
      </mesh>
      
      {/* Player shadow indicator on ground - optimized with ref */}
      <mesh ref={shadowRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
