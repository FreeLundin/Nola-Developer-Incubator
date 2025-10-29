import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Environment() {
  const asphaltTexture = useTexture("/textures/asphalt.png");
  
  // Pre-calculate building positions to avoid Math.random in render
  const buildings = useMemo(() => {
    const leftBuildings = Array.from({ length: 8 }, (_, i) => ({
      id: `left-${i}`,
      position: [-12, 3, -20 + i * 8] as [number, number, number],
      height: Math.random() * 3 + 4,
      color: ["#8e44ad", "#9b59b6", "#6c3483"][Math.floor(Math.random() * 3)],
    }));
    
    const rightBuildings = Array.from({ length: 8 }, (_, i) => ({
      id: `right-${i}`,
      position: [12, 3, -20 + i * 8] as [number, number, number],
      height: Math.random() * 3 + 4,
      color: ["#8e44ad", "#9b59b6", "#6c3483"][Math.floor(Math.random() * 3)],
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
  
  return (
    <group>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.6} color="#ffa500" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.8}
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
      
      {/* Atmospheric purple/orange glow for festive parade atmosphere */}
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#9b59b6" distance={30} />
      <pointLight position={[0, 10, -15]} intensity={0.5} color="#ff6b35" distance={30} />
      <pointLight position={[0, 10, 15]} intensity={0.5} color="#9b59b6" distance={30} />
      
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
      
      {/* Buildings */}
      {buildings.map((building) => (
        <group key={building.id} position={building.position}>
          {/* Main building */}
          <mesh castShadow>
            <boxGeometry args={[4, building.height, 6]} />
            <meshStandardMaterial color={building.color} />
          </mesh>
          
          {/* Building windows */}
          {Array.from({ length: 3 }, (_, i) => (
            <mesh key={i} position={[building.position[0] > 0 ? -2.01 : 2.01, -building.height / 2 + 1 + i * 1.5, 0]}>
              <boxGeometry args={[0.02, 0.8, 1]} />
              <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1} />
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
      
      {/* Night sky background */}
      <mesh position={[0, 0, -30]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
    </group>
  );
}
