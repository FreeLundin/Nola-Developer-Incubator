import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CatchEffectProps {
  position: THREE.Vector3;
  color: string;
  onComplete: () => void;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
}

export function CatchEffect({ position, color, onComplete }: CatchEffectProps) {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const startTime = useRef(Date.now());
  const duration = 1200; // Extended to 1.2 seconds for better visual
  
  const particles = useMemo<Particle[]>(() => {
    const count = 20; // Increased for more spectacular effect
    return Array.from({ length: count }, () => ({
      position: position.clone(),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 6, // Wider spread
        Math.random() * 6 + 3, // Higher velocity
        (Math.random() - 0.5) * 6
      ),
      life: 1.0,
    }));
  }, [position]);
  
  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);
  
  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(elapsed / duration, 1);
    
    const dummy = new THREE.Object3D();
    const particleColor = new THREE.Color(color);
    
    particles.forEach((particle, i) => {
      // Update particle physics
      particle.velocity.y -= 9.8 * delta; // Gravity
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      particle.life = 1 - progress;
      
      // Update instance transform
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.life * 0.2);
      dummy.updateMatrix();
      particlesRef.current!.setMatrixAt(i, dummy.matrix);
      particlesRef.current!.setColorAt(i, particleColor);
    });
    
    particlesRef.current.instanceMatrix.needsUpdate = true;
    if (particlesRef.current.instanceColor) {
      particlesRef.current.instanceColor.needsUpdate = true;
    }
  });
  
  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, particles.length]}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
