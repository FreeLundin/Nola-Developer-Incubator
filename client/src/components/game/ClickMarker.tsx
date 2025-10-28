import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ClickMarkerProps {
  position: THREE.Vector3;
  onComplete: () => void;
}

export function ClickMarker({ position, onComplete }: ClickMarkerProps) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const dotRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const duration = 0.8;
  
  useFrame((state, delta) => {
    progress.current += delta / duration;
    
    if (progress.current >= 1) {
      onComplete();
      return;
    }
    
    const t = progress.current;
    const easeOut = 1 - Math.pow(1 - t, 3);
    
    // Expand rings
    if (ring1Ref.current && ring2Ref.current) {
      const scale1 = 1 + easeOut * 2;
      const scale2 = 1 + easeOut * 1.5;
      ring1Ref.current.scale.set(scale1, scale1, 1);
      ring2Ref.current.scale.set(scale2, scale2, 1);
      
      // Fade out
      const opacity = 1 - easeOut;
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.6;
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.4;
    }
    
    // Pulse dot
    if (dotRef.current) {
      const pulse = 1 + Math.sin(t * Math.PI * 4) * 0.2;
      dotRef.current.scale.set(pulse, pulse, pulse);
      const opacity = 1 - easeOut;
      (dotRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });
  
  return (
    <group position={[position.x, 0.02, position.z]}>
      {/* Outer ring - optimized */}
      <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.35, 16]} />
        <meshBasicMaterial 
          color="#ffff00" 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner ring - optimized */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.2, 16]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Center dot - optimized */}
      <mesh ref={dotRef} position={[0, 0.01, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshBasicMaterial 
          color="#ffff00" 
          transparent 
          opacity={1}
        />
      </mesh>
    </group>
  );
}
