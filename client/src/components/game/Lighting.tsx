import {useEffect} from 'react';

export function Lighting() {
  // Configure the renderer globally via three settings if available
  useEffect(() => {
    try {
      // @ts-ignore
      const gl = (window as any).__R3F_GL; // not always available; graceful
      // we won't throw if not present
    } catch (e) {}
  }, []);

  return (
    <>
      {/* Warm key light */}
      <directionalLight
        castShadow
        intensity={1.0}
        color="#ffd7b5"
        position={[5, 8, 2]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Cool fill light */}
      <hemisphereLight args={["#bfe9ff", "#3a2b1f", 0.35]} />

      {/* Rim light for separation */}
      <directionalLight
        intensity={0.45}
        color="#ffd24d"
        position={[-6, 5, -3]}
      />

      {/* Subtle ambient to lift shadows */}
      <ambientLight intensity={0.15} />
    </>
  );
}
