import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlowingTrailProps {
  targetRef: React.RefObject<THREE.Mesh>;
  color: string;
  length?: number;
}

interface TrailPoint {
  position: THREE.Vector3;
  life: number;
}

export function GlowingTrail({ targetRef, color, length = 8 }: GlowingTrailProps) {
  const trailPoints = useRef<TrailPoint[]>([]);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  
  useFrame(() => {
    if (!targetRef.current || !instancedMeshRef.current) return;
    
    // Add new trail point at current position
    const currentPos = new THREE.Vector3();
    targetRef.current.getWorldPosition(currentPos);
    
    trailPoints.current.unshift({
      position: currentPos.clone(),
      life: 1.0,
    });
    
    // Keep only the last N points
    if (trailPoints.current.length > length) {
      trailPoints.current = trailPoints.current.slice(0, length);
    }
    
    // Update trail rendering
    const dummy = new THREE.Object3D();
    const trailColor = new THREE.Color(color);
    
    trailPoints.current.forEach((point, i) => {
      point.life = 1 - (i / length);
      
      dummy.position.copy(point.position);
      dummy.scale.setScalar(point.life * 0.2);
      dummy.updateMatrix();
      
      instancedMeshRef.current!.setMatrixAt(i, dummy.matrix);
      
      const fadedColor = trailColor.clone().multiplyScalar(point.life);
      instancedMeshRef.current!.setColorAt(i, fadedColor);
    });
    
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
  });
  
  return (
    <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, length]}>
      <sphereGeometry args={[0.1, 6, 6]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
