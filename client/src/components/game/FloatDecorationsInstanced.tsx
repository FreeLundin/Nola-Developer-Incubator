import React, {useMemo, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {useParadeGame} from '@/lib/stores/useParadeGame';

interface FloatDecorationsProps {
  decorationsPerFloat?: number;
}

export function FloatDecorationsInstanced({ decorationsPerFloat = 5 }: FloatDecorationsProps) {
  const MAX_INSTANCES = 4096; // capacity of the instanced mesh buffer
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);

  // Smaller, cheaper geometry for decorations (avoid large spheres that create 'street artifacts')
  const geometry = useMemo(() => new THREE.SphereGeometry(0.12, 6, 6), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FFD700', emissive: '#ffd700', emissiveIntensity: 0.6, metalness: 0.2, roughness: 0.4 }), []);

  useFrame((state) => {
    const g = useParadeGame.getState();
    const { totalFloats, getFloatSpeed } = g;
    const floatSpeed = typeof getFloatSpeed === 'function' ? getFloatSpeed() : 0;
    const elapsed = state.clock.elapsedTime;

    const desiredCount = Math.max(0, (totalFloats || 0) * decorationsPerFloat);
    const countCap = Math.min(desiredCount, MAX_INSTANCES);

    if (!meshRef.current) return;

    // Mark instanceMatrix usage dynamic for frequent updates
    try {
      (meshRef.current.instanceMatrix as any).setUsage?.(THREE.DynamicDrawUsage);
    } catch {}

    let idx = 0;

    // Mirror ParadeFloat's placement logic: startZ = -30 - (i * 10), lane X = 5 (same lane as ParadeFloat in GameScene)
    for (let fi = 0; fi < (totalFloats || 0); fi++) {
      if (idx >= countCap) break;

      const startZ = -30 - (fi * 10);
      const z = startZ + floatSpeed * elapsed; // sync with ParadeFloat motion
      const floatX = 5; // keep consistent with ParadeFloat instances (GameScene uses lane=1 => x=5)
      const bobY = 1 + Math.sin(elapsed * 0.5 + fi * 0.1) * 0.08; // slight per-float phase offset to reduce visible patterning

      for (let d = 0; d < decorationsPerFloat; d++) {
        if (idx >= countCap) break;

        // Deterministic pseudo-random per float+decoration to avoid jitter between frames
        const rx = (((fi * 13 + d * 37) % 1000) / 1000 - 0.5) * 1.2; // narrower spread
        const ry = (((fi * 19 + d * 97) % 1000) / 1000) * 1.0 + 0.25; // lower vertical variation
        const rz = (((fi * 7 + d * 61) % 1000) / 1000) * 1.2 - 0.6; // keep decorations near the float front
        const scale = (((fi * 31 + d * 11) % 1000) / 1000) * 0.3 + 0.15; // small scale

        // Place decorations relative to the float position + small random offsets
        tempPos.set(floatX + rx, bobY + ry - 0.5, z + rz);
        tempQuat.setFromEuler(new THREE.Euler(0, 0, 0));
        tempScale.setScalar(scale);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        meshRef.current.setMatrixAt(idx, tempMatrix);
        idx++;
      }
    }

    // Set the actual instance count to the number of matrices written
    meshRef.current.count = idx;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, MAX_INSTANCES]} castShadow receiveShadow />
  );
}
