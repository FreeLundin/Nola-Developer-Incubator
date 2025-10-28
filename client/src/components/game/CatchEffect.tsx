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
  const duration = 1000; // 1 second
  
  const particles = useMemo<Particle[]>(() => {
    const count = 12; // Reduced from 20 for better performance
    return Array.from({ length: count }, () => ({
      position: position.clone(),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        Math.random() * 4 + 2,
        (Math.random() - 0.5) * 3
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
      <sphereGeometry args={[0.1, 6, 6]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
}
