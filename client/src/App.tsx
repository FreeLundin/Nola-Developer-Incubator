import React, {Suspense, useCallback, useEffect, useState} from "react";
import {KeyboardControls} from "@react-three/drei";
import {GameUI} from "./components/game/GameUI";
import {WinScreen} from "./components/game/WinScreen";
import {AudioManager} from "./components/game/AudioManager";
import {AdRewardScreen} from "./components/game/AdRewardScreen";
import {TouchControls, TouchInput} from "./components/game/TouchControls";
import {CatchArea} from './components/game/CatchArea';
import {Controls, JoystickInput} from "./components/game/Player";
import {useParadeGame} from "./lib/stores/useParadeGame";
import {useIsMobile} from "./hooks/use-is-mobile";
import DevOverlay from "./components/game/DevOverlay";
// Lazy-load the heavy Canvas and scene to defer loading R3F/drei until needed
const GameCanvas = React.lazy(() => import("./components/game/GameCanvas"));

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.back, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
];

function App() {
  const joystickEnabled = useParadeGame((state) => state.joystickEnabled);
  const startGame = useParadeGame((s) => s.startGame);
  const phase = useParadeGame((state) => state.phase);
  const isMobile = useIsMobile();
  const [joystickInput, setJoystickInput] = useState<JoystickInput | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  // Auto-start behavior for test environments: if URL contains `autoStart=true` or running on localhost
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const auto = params.get('autoStart') === 'true' || window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
      if (auto) {
        setGameStarted(true);
        // startGame may be a no-op if already started but safe to call
        setTimeout(() => startGame(), 50);
      }
    } catch (e) { /* ignore in non-browser env */ }
  }, [startGame]);

  // Prefetch GameCanvas when user hovers Play to reduce wait
  const prefetchCanvas = () => { void import('./components/game/GameCanvas'); };

  const handleJoystickInput = useCallback((input: TouchInput) => {
    setJoystickInput({ x: input.x, y: input.y });
  }, []);
  
  // Clear joystick input when joystick is disabled or gameplay ends
  useEffect(() => {
    if (!joystickEnabled || phase !== "playing") {
      setJoystickInput(null);
    }
  }, [joystickEnabled, phase]);
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KeyboardControls map={controls}>
        {/* Show a Play overlay until user starts the game. This defers loading the heavy 3D bundle. */}
        {!gameStarted && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', zIndex: 50 }}>
            <button
              onMouseEnter={prefetchCanvas}
              onClick={() => { setGameStarted(true); startGame(); }}
              style={{ padding: '18px 28px', fontSize: 20, borderRadius: 12, background: '#ff6b35', color: 'white', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', cursor: 'pointer' }}
            >
              Play Mardi Gras Parade
            </button>
          </div>
        )}

        {gameStarted && (
          <Suspense fallback={null}>
            <GameCanvas joystickInput={joystickInput} />
          </Suspense>
        )}
        
        <GameUI />
        <WinScreen />
        <AdRewardScreen />
        <AudioManager />
        
        {/* Touch Controls - only show when joystick is enabled on mobile during gameplay */}
        {isMobile && joystickEnabled && phase === "playing" && (
          <>
            <TouchControls onInput={handleJoystickInput} />
            <CatchArea />
          </>
         )}

        {process.env.NODE_ENV === 'development' && <DevOverlay />}
      </KeyboardControls>
    </div>
  );
}

export default App;
