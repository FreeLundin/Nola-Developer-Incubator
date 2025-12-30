import React, {Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {GameScene} from './GameScene';
import {useParadeGame} from '../../lib/stores/useParadeGame';

interface GameCanvasProps {
  joystickInput?: { x: number; y: number } | null;
}

export default function GameCanvas({ joystickInput }: GameCanvasProps) {
  // Read shadow setting from the store. Cast to any to avoid transient type mismatch
  // across different TypeScript resolution contexts.
  const enableShadows = useParadeGame((s: any) => s.settings?.enableShadows ?? true);

  return (
    <Canvas
      shadows={enableShadows}
      camera={{ position: [0, 4, 6], fov: 60, near: 0.1, far: 1000 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={["#0f0f1e"]} />
      <Suspense fallback={null}>
        <GameScene joystickInput={joystickInput} />
      </Suspense>
    </Canvas>
  );
}
