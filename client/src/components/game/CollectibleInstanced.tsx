import React, {useMemo, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {type Collectible as CollectibleType, useParadeGame} from '@/lib/stores/useParadeGame';

interface CollectibleInstancedProps {
  types: CollectibleType['type'][]; // e.g., ['beads','doubloon','cup']
  playerPosition: THREE.Vector3;
}

export function CollectibleInstanced({ types, playerPosition }: CollectibleInstancedProps) {
  // We'll render one instancedMesh per collectible type for per-type materials/colors.
  const typesList = ['beads', 'doubloon', 'cup'] as const;
  const perTypeRefs = useRef<Record<string, THREE.InstancedMesh | null>>({});
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);

  const { removeCollectible, updateCollectible, incrementMisses } = useParadeGame();

  const geometry = useMemo(() => new THREE.SphereGeometry(0.25, 8, 8), []);

  // Create per-type materials so colors can differ
  const materials = useMemo(() => ({
    beads: new THREE.MeshStandardMaterial({ color: '#9b59b6', metalness: 0.6, roughness: 0.2 }),
    doubloon: new THREE.MeshStandardMaterial({ color: '#f1c40f', metalness: 0.9, roughness: 0.15 }),
    cup: new THREE.MeshStandardMaterial({ color: '#e74c3c', metalness: 0.4, roughness: 0.35 }),
  }), []);

  useFrame((state, delta) => {
    const storeCollectibles = useParadeGame.getState().collectibles;
    // For each type, filter and render
    const GRAVITY = -15;
    const CATCH_RADIUS = 2.0;
    const MIN_CATCH_HEIGHT = 0.5;
    const GROUND_PICKUP_WINDOW_MS = 1000;

    for (const t of typesList) {
      const list = storeCollectibles.filter(c => c.type === t);
      const mesh = perTypeRefs.current[t];
      if (!mesh) continue;
      // Ensure capacity
      mesh.count = list.length;

      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        // Basic physics/resync: apply gravity and simple ground handling locally
        const position = c.position.clone();
        const velocity = c.velocity.clone();

        velocity.y += GRAVITY * delta;
        position.add(velocity.clone().multiplyScalar(delta));

        const isOnGround = position.y <= 0.3;
        if (isOnGround) {
          position.y = 0.3;
          // friction
          velocity.x *= 0.9; velocity.z *= 0.9;
          if (Math.abs(velocity.y) > 0.5) velocity.y = -velocity.y * 0.4; else velocity.y = 0;
        }

        // Catch detection
        const distanceToPlayer = position.distanceTo(playerPosition);
        const isAboveGround = position.y >= MIN_CATCH_HEIGHT;
        const isInRange = distanceToPlayer < CATCH_RADIUS;
        const timeOnGround = 0; // we don't track exact ground time here in instancer
        const isGroundPickupWindow = false;
        const isCatchable = isInRange && ((isAboveGround && position.y < 2) || isGroundPickupWindow);
        if (isCatchable && distanceToPlayer < 0.8) {
          try { removeCollectible(c.id); } catch {}
          continue; // don't set matrix for removed
        }

        // Compose matrix
        tempPos.copy(position);
        tempQuat.setFromEuler(new THREE.Euler(0, state.clock.elapsedTime * 0.5, 0));
        tempScale.setScalar(t === 'cup' ? 0.3 : 0.25);
        tempMatrix.compose(tempPos, tempQuat, tempScale);
        mesh.setMatrixAt(i, tempMatrix);

        // Sync back approximate pos & vel into store for other systems
        updateCollectible(c.id, { position: position.clone(), velocity: velocity.clone() });
      }

      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  // Render three instanced meshes (one per type)
  return (
    <>
      <instancedMesh ref={(r) => (perTypeRefs.current['beads'] = r)} args={[geometry, materials['beads'], 1024]} castShadow />
      <instancedMesh ref={(r) => (perTypeRefs.current['doubloon'] = r)} args={[geometry, materials['doubloon'], 1024]} castShadow />
      <instancedMesh ref={(r) => (perTypeRefs.current['cup'] = r)} args={[geometry, materials['cup'], 1024]} castShadow />
    </>
  );
}
