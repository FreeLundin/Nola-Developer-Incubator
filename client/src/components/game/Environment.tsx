import { useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { InstanceSetter } from "./InstanceSetter";

export function Environment() {
  // Load texture with safe loader and fallback to undefined on error to avoid uncaught throws
  // Use a manual TextureLoader so we can attach an onError handler
  const asphaltTexture = (() => {
    try {
      // prefer useTexture when available, but wrap in try to catch runtime loader errors
      // the useTexture hook can throw when the image fails to load; use a defensive approach
      // by creating a loader and returning a texture or undefined.
      const loader = new THREE.TextureLoader();
      let tex: THREE.Texture | undefined = undefined;
      loader.load(
        '/textures/asphalt.png',
        (t) => { tex = t; },
        undefined,
        (err) => { console.warn('[Environment] failed to load asphalt texture', err); tex = undefined; }
      );
      return tex;
    } catch (e) {
      console.warn('[Environment] texture load threw', e);
      return undefined;
    }
  })();

  const spotlightGroupRef = useRef<THREE.Group>(null);
  
  // Use a low-detail mode in development to avoid WebGL context loss from too many meshes
  // Dev builds often run with HMR and smaller GPUs; reduce counts to keep the scene stable.
  // Safe access to Vite's import.meta.env.DEV; wrap in try/catch for environments
  // where import.meta may not be available to avoid compile/runtime errors.
  const DEV_LOW_DETAIL = (() => {
    try {
      // import.meta is supported by Vite; cast to any to access env in TS safely
      return Boolean((import.meta as any)?.env?.DEV);
    } catch {
      return false;
    }
  })();

  // Pre-calculate building positions to avoid Math.random in render
  const buildings = useMemo(() => {
    const mardiGrasColors = ["#722F9A", "#228B22", "#FFD700"]; // Purple, Green, Gold
    const countPerSide = DEV_LOW_DETAIL ? 4 : 8;
    const leftBuildings = Array.from({ length: countPerSide }, (_, i) => ({
      id: `left-${i}`,
      position: [-12, 3, -20 + i * 8] as [number, number, number],
      height: Math.random() * 3 + 4,
      color: mardiGrasColors[Math.floor(Math.random() * 3)],
    }));
    
    const rightBuildings = Array.from({ length: countPerSide }, (_, i) => ({
      id: `right-${i}`,
      position: [12, 3, -20 + i * 8] as [number, number, number],
      height: Math.random() * 3 + 4,
      color: mardiGrasColors[Math.floor(Math.random() * 3)],
    }));
    
    return [...leftBuildings, ...rightBuildings];
  }, []);
  
  // Pre-calculate street lamp positions
  const streetLamps = useMemo(() => {
    const lamps = [];
    const range = DEV_LOW_DETAIL ? 2 : 3;
    for (let i = -range; i <= range; i++) {
      lamps.push({
        id: `lamp-left-${i}`,
        position: [-9, 0, i * 6] as [number, number, number],
      });
      lamps.push({
        id: `lamp-right-${i}`,
        position: [9, 0, i * 6] as [number, number, number],
      });
    }
    return lamps;
  }, []);
  
  // Pre-calculate banner positions for Mardi Gras decorations
  const banners = useMemo(() => {
    const count = DEV_LOW_DETAIL ? 3 : 6;
    return Array.from({ length: count }, (_, i) => ({
      id: `banner-${i}`,
      position: [0, 6, -15 + i * 6] as [number, number, number],
      colors: [
        ["#722F9A", "#FFD700"], // Purple & Gold
        ["#228B22", "#722F9A"], // Green & Purple
        ["#FFD700", "#228B22"], // Gold & Green
      ][i % 3],
    }));
  }, []);
  
  // Pre-calculate crowd silhouettes (reduced in DEV)
  const crowdPositions = useMemo(() => {
    const crowd = [];
    const rows = DEV_LOW_DETAIL ? 3 : 9; // fewer rows in dev
    const perSide = DEV_LOW_DETAIL ? 3 : 8; // fewer people per row in dev
    for (let i = -Math.floor(rows/2); i <= Math.floor(rows/2); i++) {
      // Left side crowd
      for (let j = 0; j < perSide; j++) {
        crowd.push({
          id: `crowd-left-${i}-${j}`,
          position: [-8.5, 0.4, i * 5 + (Math.random() - 0.5) * 2] as [number, number, number],
          height: Math.random() * 0.3 + 0.6,
        });
      }
      // Right side crowd
      for (let j = 0; j < perSide; j++) {
        crowd.push({
          id: `crowd-right-${i}-${j}`,
          position: [8.5, 0.4, i * 5 + (Math.random() - 0.5) * 2] as [number, number, number],
          height: Math.random() * 0.3 + 0.6,
        });
      }
    }
    return crowd;
  }, []);
  
  // Animate spotlights sweeping across the scene
  useFrame((state) => {
    if (spotlightGroupRef.current) {
      spotlightGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  
  return (
    <group>
      {/* Enhanced Lighting System */}
      <ambientLight intensity={0.4} color="#FFD700" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={DEV_LOW_DETAIL ? 0.8 : 1}
        color="#ffffff"
        castShadow={!DEV_LOW_DETAIL}
        shadow-mapSize-width={DEV_LOW_DETAIL ? 1024 : 2048}
        shadow-mapSize-height={DEV_LOW_DETAIL ? 1024 : 2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Mardi Gras tri-color atmospheric lighting */}
      <pointLight position={[-10, 12, 0]} intensity={1.2} color="#722F9A" distance={35} />
      <pointLight position={[10, 12, 0]} intensity={1.2} color="#228B22" distance={35} />
      <pointLight position={[0, 15, -10]} intensity={1} color="#FFD700" distance={30} />
      <pointLight position={[0, 15, 10]} intensity={1} color="#722F9A" distance={30} />

      {/* Animated parade spotlights */}
      <group ref={spotlightGroupRef} position={[0, 12, 0]}>
        <spotLight position={[-8, 0, 5]} angle={0.3} penumbra={0.5} intensity={DEV_LOW_DETAIL ? 0.8 : 2} color="#722F9A" distance={20} />
        <spotLight position={[8, 0, 5]} angle={0.3} penumbra={0.5} intensity={DEV_LOW_DETAIL ? 0.8 : 2} color="#228B22" distance={20} />
        <spotLight position={[0, 0, -8]} angle={0.4} penumbra={0.6} intensity={DEV_LOW_DETAIL ? 0.6 : 1.5} color="#FFD700" distance={25} />
      </group>

      {/* Street/Ground - Main parade route */}
      <mesh receiveShadow={!DEV_LOW_DETAIL} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 50]} />
        {/* If texture failed to load, fallback to a neutral dark road color to avoid runtime errors */}
        {asphaltTexture ? (
          <meshStandardMaterial
            map={asphaltTexture}
            map-repeat={new THREE.Vector2(3, 10)}
            map-wrapS={THREE.RepeatWrapping}
            map-wrapT={THREE.RepeatWrapping}
          />
        ) : (
          <meshStandardMaterial color="#2b2b2b" />
        )}
      </mesh>
      
      {/* Street yellow center line */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.2, 50]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Sidewalks */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-8.5, 0.01, 0]}>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[8.5, 0.01, 0]}>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Curbs - visual street boundaries */}
      <mesh castShadow position={[-7, 0.15, 0]}>
        <boxGeometry args={[0.3, 0.3, 50]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh castShadow position={[7, 0.15, 0]}>
        <boxGeometry args={[0.3, 0.3, 50]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      
      {/* Buildings with enhanced windows */}
      {buildings.map((building) => (
        <group key={building.id} position={building.position}>
          {/* Main building */}
          <mesh castShadow>
            <boxGeometry args={[4, building.height, 6]} />
            <meshStandardMaterial 
              color={building.color}
              emissive={building.color}
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Enhanced glowing building windows */}
          {Array.from({ length: 3 }, (_, i) => (
            <mesh key={i} position={[building.position[0] > 0 ? -2.01 : 2.01, -building.height / 2 + 1 + i * 1.5, 0]}>
              <boxGeometry args={[0.02, 0.8, 1]} />
              <meshStandardMaterial 
                color="#FFD700" 
                emissive="#FFD700" 
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Street lamps */}
      {streetLamps.map((lamp) => (
        <group key={lamp.id} position={lamp.position}>
          {/* Lamp post */}
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
            <meshStandardMaterial color="#2c2c2c" />
          </mesh>
          
          {/* Lamp light */}
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1} />
          </mesh>
          <pointLight position={[0, 2.2, 0]} intensity={1} color="#ffd700" distance={8} />
        </group>
      ))}
      
      {/* Vibrant gradient sky backdrop - Mardi Gras sunset */}
      <mesh position={[0, 15, -30]}>
        <planeGeometry args={[80, 50]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, 22, -29]}>
        <planeGeometry args={[80, 20]} />
        <meshBasicMaterial color="#722F9A" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 28, -28]}>
        <planeGeometry args={[80, 10]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
      </mesh>
      
      {/* Mardi Gras banners hanging across the street */}
      {banners.map((banner) => (
        <group key={banner.id} position={banner.position}>
          {/* Banner left side */}
          <mesh position={[-4, 0, 0]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[4, 1.5, 0.05]} />
            <meshStandardMaterial 
              color={banner.colors[0]} 
              emissive={banner.colors[0]} 
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Banner right side */}
          <mesh position={[4, 0, 0]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[4, 1.5, 0.05]} />
            <meshStandardMaterial 
              color={banner.colors[1]} 
              emissive={banner.colors[1]} 
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* String connecting banners */}
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 8, 6]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      ))}
      
      {/* String lights across the street */}
      {Array.from({ length: 8 }, (_, i) => {
        const colors = ["#722F9A", "#228B22", "#FFD700"];
        return (
          <group key={`lights-${i}`} position={[0, 5, -18 + i * 6]}>
            {Array.from({ length: 12 }, (_, j) => (
              <mesh key={j} position={[-6 + j * 1, Math.sin(j) * 0.3, 0]}>
                <sphereGeometry args={[0.1, 6, 6]} />
                <meshStandardMaterial 
                  color={colors[j % 3]} 
                  emissive={colors[j % 3]} 
                  emissiveIntensity={3}
                />
              </mesh>
            ))}
          </group>
        );
      })}
      
      {/* Crowd silhouettes on sidewalks - use instancing for performance */}
      {(() => {
        const count = crowdPositions.length;
        const instRef = useRef<THREE.InstancedMesh>(null);
        return (
          <instancedMesh ref={instRef} args={[undefined as any, undefined as any, count]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial color="#1a1a1a" />
            <InstanceSetter positions={crowdPositions} meshRef={instRef} />
          </instancedMesh>
        );
      })()}
    </group>
  );
}
