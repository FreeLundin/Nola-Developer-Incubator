import { useEffect, useRef, RefObject } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

interface InstanceSetterProps {
  positions: { id: string; position: [number, number, number]; height: number }[];
  // Optional ref to the InstancedMesh to populate. Prefer passing this from parent.
  meshRef?: RefObject<THREE.InstancedMesh>;
}

export function InstanceSetter({ positions, meshRef }: InstanceSetterProps) {
  const localRef = useRef<THREE.InstancedMesh | null>(null);
  const { scene } = useThree();

  useEffect(() => {
    let inst: THREE.InstancedMesh | null = null;

    // Prefer explicit ref if provided
    if (meshRef && meshRef.current) {
      inst = meshRef.current;
    } else if (localRef && localRef.current) {
      inst = localRef.current;
    } else {
      // Fallback: search scene for a matching instanced mesh
      scene.traverse((obj) => {
        if (inst) return;
        if ((obj as any).isInstancedMesh) {
          const candidate = obj as THREE.InstancedMesh;
          if (candidate.count === positions.length) {
            inst = candidate;
          }
        }
      });
    }

    if (!inst) {
      console.warn('[InstanceSetter] Could not find matching instanced mesh to populate');
      return;
    }

    const dummy = new THREE.Object3D();
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      dummy.position.set(p.position[0], p.position[1] + p.height / 2, p.position[2]);
      dummy.scale.set(1, p.height, 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  }, [positions, scene, meshRef]);

  return null;
}
