import { useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Environment() {
  // Use Vite's BASE_URL so textures resolve correctly when the app is served from a subpath
  const asphaltTexture = useTexture(`${import.meta.env.BASE_URL}textures/asphalt.png`);
  const spotlightGroupRef = useRef<THREE.Group>(null);
  
  // Pre-calculate building positions to avoid Math.random in render
  const buildings = useMemo(() => {
    const mardiGrasColors = ["#722F9A", "#228B22", "#FFD700"]; // Purple, Green, Gold
    const leftBuildings = Array.from({ length: 8 }, (_, i) => ({
      id: `left-${i}`,
      position: [-12, 3, -20 + i * 8] as [number, number, number],
      height: Math.random() * 3 + 4,
      color: mardiGrasColors[Math.floor(Math.random() * 3)],
    }));
    
    const rightBuildings = Array.from({ length: 8 }, (_, i) => ({
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
    for (let i = -3; i <= 3; i++) {
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
    return Array.from({ length: 6 }, (_, i) => ({
      id: `banner-${i}`,
      position: [0, 6, -15 + i * 6] as [number, number, number],
      colors: [
        ["#722F9A", "#FFD700"], // Purple & Gold
        ["#228B22", "#722F9A"], // Green & Purple
        ["#FFD700", "#228B22"], // Gold & Green
      ][i % 3],
    }));
  }, []);
  
  // Pre-calculate crowd silhouettes
  const crowdPositions = useMemo(() => {
    const crowd = [];
    for (let i = -4; i <= 4; i++) {
      // Left side crowd
      for (let j = 0; j < 8; j++) {
        crowd.push({
          id: `crowd-left-${i}-${j}`,
          position: [-8.5, 0.4, i * 5 + (Math.random() - 0.5) * 2] as [number, number, number],
          height: Math.random() * 0.3 + 0.6,
        });
      }
      // Right side crowd
      for (let j = 0; j < 8; j++) {
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
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
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
        <spotLight position={[-8, 0, 5]} angle={0.3} penumbra={0.5} intensity={2} color="#722F9A" distance={20} />
        <spotLight position={[8, 0, 5]} angle={0.3} penumbra={0.5} intensity={2} color="#228B22" distance={20} />
        <spotLight position={[0, 0, -8]} angle={0.4} penumbra={0.6} intensity={1.5} color="#FFD700" distance={25} />
      </group>
      
      {/* Street/Ground - Main parade route */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 50]} />
        <meshStandardMaterial 
          map={asphaltTexture} 
          map-repeat={new THREE.Vector2(3, 10)}
          map-wrapS={THREE.RepeatWrapping}
          map-wrapT={THREE.RepeatWrapping}
        />
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
      
      {/* Crowd silhouettes on sidewalks */}
      {crowdPositions.map((person) => (
        <mesh key={person.id} position={person.position} castShadow>
          <boxGeometry args={[0.3, person.height, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  );
}
