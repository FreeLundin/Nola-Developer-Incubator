import React from 'react';
import { useParadeGame } from '@/lib/stores/useParadeGame';
import * as THREE from 'three';

export function HelperBotVisual({ playerPosition }: { playerPosition: THREE.Vector3 }) {
  const helperBots = useParadeGame((s) => s.helperBots);
  if (!helperBots || helperBots <= 0) return null;

  // Simple visual: small glowing orbs orbiting the player
  const orbs = Array.from({ length: helperBots }, (_, i) => {
    const angle = (Date.now() / 500 + i * (Math.PI * 2) / helperBots);
    const x = playerPosition.x + Math.cos(angle) * (1.5 + i * 0.4);
    const z = playerPosition.z + Math.sin(angle) * (1.5 + i * 0.4);
    const y = playerPosition.y + 0.8;
    return { position: [x, y, z], color: '#7CFC00' };
  });

  return (
    <group>
      {orbs.map((o, idx) => (
        <mesh key={idx} position={o.position as any}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial emissive={o.color} color={o.color} emissiveIntensity={2} metalness={0.6} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

