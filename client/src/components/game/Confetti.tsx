import React, {useMemo, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

interface ConfettiProps {
  count?: number;
  origin?: [number, number, number];
  colors?: string[];
}

export function Confetti({ count = 200, origin = [0, 2, -5], colors = ['#582C83', '#FFC72C', '#2FA84F'] }: ConfettiProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Per-instance data
  const instances = useMemo(() => {
    const arr: { pos: THREE.Vector3; vel: THREE.Vector3; life: number; color: string }[] = [];
    for (let i = 0; i < count; i++) {
      const pos = new THREE.Vector3(
        origin[0] + (Math.random() - 0.5) * 1.5,
        origin[1] + Math.random() * 0.6,
        origin[2] + (Math.random() - 0.5) * 1.5
      );
      const vel = new THREE.Vector3((Math.random() - 0.5) * 0.4, Math.random() * 2 + 1.5, (Math.random() - 0.5) * 0.4);
      const life = Math.random() * 1.2 + 0.8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      arr.push({ pos, vel, life, color });
    }
    return arr;
  }, [count, origin, colors]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < instances.length; i++) {
      const it = instances[i];
      it.vel.y -= 9.81 * delta * 0.25; // gravity
      it.pos.add(it.vel.clone().multiplyScalar(delta));
      it.life -= delta;

      if (it.life <= 0 || it.pos.y < 0) {
        // recycle
        it.pos.set(origin[0] + (Math.random() - 0.5) * 1.5, origin[1] + Math.random() * 0.6, origin[2] + (Math.random() - 0.5) * 1.5);
        it.vel.set((Math.random() - 0.5) * 0.4, Math.random() * 2 + 1.5, (Math.random() - 0.5) * 0.4);
        it.life = Math.random() * 1.2 + 0.8;
      }

      dummy.position.copy(it.pos);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.06;
      dummy.scale.set(s, s * 1.6, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      // set color via instanceColor (if available)
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial vertexColors={false} color="#ffffff" />
    </instancedMesh>
  );
}
