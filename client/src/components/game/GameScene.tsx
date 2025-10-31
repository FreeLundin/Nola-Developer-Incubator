
interface CatchEffectInstance {
  id: string;
  position: THREE.Vector3;
  color: string;
}

interface ClickMarkerInstance {
  id: string;
  position: THREE.Vector3;
}

export function GameScene() {
  const { 
    phase, 
    collectibles, 
    addCatch, 
    combo, 
    totalFloats, 
    level, 
    getFloatSpeed, 
    eliminatePlayer,
    aggressiveNPCs,
    hitAggressiveNPC,
    aggressiveNPCHitPlayer,
    endNPCChase,
  } = useParadeGame();
  const { playHit, playFireworks } = useAudio();
  const { camera, gl } = useThree();
  const isMobile = useIsMobile();
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0.5, 0));
  const [mouseTarget, setMouseTarget] = useState<THREE.Vector3 | null>(null);
  const [catchEffects, setCatchEffects] = useState<CatchEffectInstance[]>([]);
  const [clickMarkers, setClickMarkers] = useState<ClickMarkerInstance[]>([]);
  const floatStartTime = useState(() => Date.now())[0];
  
  // Check for float-player collision
  useEffect(() => {
    if (phase !== "playing") return;
    
    const checkCollision = () => {
      const floatSpeed = getFloatSpeed();
      const elapsedTime = (Date.now() - floatStartTime) / 1000; // seconds
      const floatX = 5; // Floats are on lane 1 (x = 5)
      const floatWidth = 2.5; // Float collision width
      const floatLength = 3; // Float collision length
      
      // Check each float position
      for (let i = 0; i < totalFloats; i++) {
        const startZ = -30 - (i * 10);
        const currentZ = startZ + (floatSpeed * elapsedTime);
        
        // Only check floats that are near the player area
        if (currentZ > -20 && currentZ < 20) {
          // Check if player is too close to this float
          const distanceX = Math.abs(playerPosition.x - floatX);
          const distanceZ = Math.abs(playerPosition.z - currentZ);
          
          if (distanceX < floatWidth && distanceZ < floatLength) {
            console.log(`💥 Player hit by float at position (${floatX}, ${currentZ})!`);
            eliminatePlayer();
            return;
          }
        }
      }
    };
    
    const interval = setInterval(checkCollision, 100); // Check every 100ms
    return () => clearInterval(interval);
  }, [phase, playerPosition, totalFloats, floatStartTime, getFloatSpeed, eliminatePlayer]);
  
  // Play fireworks sound on high combos
  useEffect(() => {
    if (combo >= 3) {
      playFireworks();
    }
  }, [combo, playFireworks]);
  
  // Handle click/tap for movement on all devices
  useEffect(() => {
    if (phase !== "playing") return;
    
    const handleClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Create raycaster
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      // Create a ground plane to raycast against
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      
      // Get intersection point - check if it succeeded
      const intersected = raycaster.ray.intersectPlane(groundPlane, target);
      
      if (intersected) {
        // Constrain to street bounds
        target.x = THREE.MathUtils.clamp(target.x, -6.5, 6.5);
        target.z = THREE.MathUtils.clamp(target.z, -15, 15);
        target.y = 0.5; // Player height
        
        setMouseTarget(target.clone());
        
        // Add click marker
        const markerId = `click-${Date.now()}`;
        setClickMarkers((prev) => [
          ...prev,
          {
            id: markerId,
            position: target.clone(),
          },
        ]);
        
        console.log("Mouse click target:", target);
      }
    };
    
    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [phase, camera, gl, isMobile]);
  
  // Handle clearing mouse target
  const handleClearMouseTarget = useCallback(() => {
    setMouseTarget(null);
  }, []);
  
  // Handle obstacle collision
  const handleObstacleCollision = useCallback(() => {
    // Break combo on obstacle hit
    const currentCombo = useParadeGame.getState().combo;
    if (currentCombo > 0) {
      useParadeGame.setState({ combo: 0, lastCatchTime: 0 });
      console.log("Obstacle hit! Combo broken.");
    }
  }, []);
  
  // Handle player catch
  const handleCatch = useCallback((type: "beads" | "doubloon" | "cup" | "king_cake" | "speed_boost" | "double_points") => {
    console.log("Catch successful!", type);
    playHit();
    
    const isPowerUp = type === "speed_boost" || type === "double_points";
    const isSpecial = type === "king_cake";
    
    if (isPowerUp) {
      // Activate power-up
      useParadeGame.getState().activatePowerUp(type as "speed_boost" | "double_points");
    } else if (isSpecial) {
      // King cake worth flat 5 points (bypasses power-ups and color bonuses)
      for (let i = 0; i < 5; i++) {
        addCatch(undefined, true); // Bypass power-up multiplier
      }
    } else {
      // Regular collectible - pass type for color matching
      addCatch(type);
    }
    
    // Add catch effect
    const effectId = `catch-${Date.now()}`;
    const effectColor = isPowerUp ? "#00ffff" : isSpecial ? "#ff6b35" : "#ffd700";
    setCatchEffects((prev) => [
      ...prev,
      {
        id: effectId,
        position: playerPosition.clone(),
        color: effectColor,
      },
    ]);
    
    // Remove effect after duration
    setTimeout(() => {
      setCatchEffects((prev) => prev.filter((e) => e.id !== effectId));
    }, 1100);
  }, [playHit, addCatch, playerPosition]);
  
  return (
    <group>
      {/* Environment - always visible */}
      <Environment />
      
      {/* Player - starts behind center line */}
      <Player 
        position={[0, 0.5, -8]} 
        onPositionChange={setPlayerPosition} 
        mouseTarget={mouseTarget}
        onClearMouseTarget={handleClearMouseTarget}
      />
      
      {/* Camera */}
      <GameCamera playerPosition={playerPosition} />
      
      {/* Gameplay elements only during playing phase */}
      {phase === "playing" && (
        <>
          {/* Parade Floats - dynamically generated based on level (10 floats per level) */}
          {Array.from({ length: totalFloats }, (_, i) => {
            const colors = ["#9b59b6", "#e74c3c", "#ff6b35", "#3498db", "#f39c12", "#1abc9c", "#e91e63", "#9c27b0"];
            const color = colors[i % colors.length];
            const startZ = -30 - (i * 10); // Space floats 10 units apart
            return (
              <ParadeFloat 
                key={`float-${level}-${i}`}
                id={`float-${level}-${i}`}
                startZ={startZ}
                lane={1}
                color={color}
                playerPosition={playerPosition}
              />
            );
          })}
          
          {/* Competitor Bots - scaled by level for casual gameplay (ages 10-80) */}
          {/* Level 1-2: 2 bots, Level 3: 3 bots, Level 4+: All 6 bots */}
          {level >= 1 && <CompetitorBot id="King Rex" startX={-5.5} startZ={-13} color="#ff4444" />}
          {level >= 1 && <CompetitorBot id="Queen Zulu" startX={5} startZ={-10} color="#44ff44" />}
          {level >= 3 && <CompetitorBot id="Jester Jazz" startX={-2} startZ={-7} color="#4444ff" />}
          {level >= 4 && <CompetitorBot id="Bead Baron" startX={3} startZ={-12} color="#ffff44" />}
          {level >= 5 && <CompetitorBot id="Doubloon Duke" startX={-4} startZ={-9} color="#ff44ff" />}
          {level >= 6 && <CompetitorBot id="Mardi Gal" startX={1} startZ={-8} color="#44ffff" />}
          
          {/* Aggressive NPCs - black/white squares that chase player when hit */}
          {aggressiveNPCs.map((npc) => (
            <AggressiveNPC
              key={npc.id}
              id={npc.id}
              position={npc.position}
              isChasing={npc.isChasing}
              playerPosition={playerPosition}
              onHitPlayer={() => aggressiveNPCHitPlayer(npc.id)}
              onPlayerHitNPC={() => hitAggressiveNPC(npc.id)}
              chaseEndTime={npc.chaseEndTime}
              onChaseEnd={() => endNPCChase(npc.id)}
            />
          ))}
          
          {/* Moving Obstacles - gentle in early levels, increases after level 3 */}
          {Array.from({ length: useParadeGame.getState().getObstacleCount(level) }, (_, i) => {
            const startX = (Math.random() * 13 - 6.5);
            const startZ = (Math.random() * 30 - 15);
            return (
              <Obstacle 
                key={`obstacle-${level}-${i}`}
                id={`obstacle-${level}-${i}`}
                startPosition={[startX, 0.5, startZ]}
                playerPosition={playerPosition}
                onCollision={handleObstacleCollision}
              />
            );
          })}
          
          {/* Collectibles */}
          {collectibles.map((collectible) => (
            <Collectible
              key={collectible.id}
              collectible={collectible}
              playerPosition={playerPosition}
              onCatch={handleCatch}
            />
          ))}
          
          {/* Catch Effects */}
          {catchEffects.map((effect) => (
            <CatchEffect
              key={effect.id}
              position={effect.position}
              color={effect.color}
              onComplete={() => {
                setCatchEffects((prev) => prev.filter((e) => e.id !== effect.id));
              }}
            />
          ))}
          
          {/* Click Markers */}
          {clickMarkers.map((marker) => (
            <ClickMarker
              key={marker.id}
              position={marker.position}
              onComplete={() => {
                setClickMarkers((prev) => prev.filter((m) => m.id !== marker.id));
              }}
            />
          ))}
        </>
      )}
    </group>
  );
}
