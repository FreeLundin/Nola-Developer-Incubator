import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import * as THREE from "three";

interface GameCameraProps {
  playerPosition: THREE.Vector3;
}

export function GameCamera({ playerPosition }: GameCameraProps) {
  const { camera } = useThree();
  const { cameraMode } = useParadeGame();
  
  const currentCameraPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  
  useEffect(() => {
    console.log(`Camera mode changed to: ${cameraMode}`);
  }, [cameraMode]);
  
  useFrame((state, delta) => {
    // Define camera positions based on mode
    let targetCameraPos: THREE.Vector3;
    let targetLookAt: THREE.Vector3;
    
    if (cameraMode === "third-person") {
      // Third-person camera: behind and above the player
      targetCameraPos = new THREE.Vector3(
        playerPosition.x,
        playerPosition.y + 4,
        playerPosition.z + 6
      );
      targetLookAt = new THREE.Vector3(
        playerPosition.x,
        playerPosition.y + 1,
        playerPosition.z
      );
    } else {
      // First-person camera: at player's eye level, looking forward
      targetCameraPos = new THREE.Vector3(
        playerPosition.x,
        playerPosition.y + 1.5,
        playerPosition.z
      );
      targetLookAt = new THREE.Vector3(
        playerPosition.x,
        playerPosition.y + 1.5,
        playerPosition.z - 5
      );
    }
    
    // Smoothly interpolate camera position and look-at
    const lerpFactor = 5 * delta;
    currentCameraPos.current.lerp(targetCameraPos, lerpFactor);
    currentLookAt.current.lerp(targetLookAt, lerpFactor);
    
    // Update camera
    camera.position.copy(currentCameraPos.current);
    camera.lookAt(currentLookAt.current);
  });
  
  return null;
}
