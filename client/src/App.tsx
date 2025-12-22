import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useCallback, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { GameScene } from "./components/game/GameScene";
import { GameUI } from "./components/game/GameUI";
import { WinScreen } from "./components/game/WinScreen";
import { AudioManager } from "./components/game/AudioManager";
import { AdRewardScreen } from "./components/game/AdRewardScreen";
import { TouchControls, TouchInput } from "./components/game/TouchControls";
import { Controls, JoystickInput } from "./components/game/Player";
import { useParadeGame } from "./lib/stores/useParadeGame";
import { useIsMobile } from "./hooks/use-is-mobile";

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.back, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
];

function App() {
  const joystickEnabled = useParadeGame((state) => state.joystickEnabled);
  const phase = useParadeGame((state) => state.phase);
  const isMobile = useIsMobile();
  const [joystickInput, setJoystickInput] = useState<JoystickInput | null>(null);
  
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
      {/* Clickable logo linking to public playtest. Prefer user-provided PNG if present, otherwise fallback to favicon. */}
      {/* Place your PNG at client/public/Copilot_20251220_062127.png to use it automatically. */}
      {
        (() => {
          const [imgSrc, setImgSrc] = (function() {
            // lightweight self-contained hook emulation inside JSX to avoid adding imports
            const src = typeof window !== 'undefined' && (window as any).__INITIAL_LOGO_SRC__ ? (window as any).__INITIAL_LOGO_SRC__ : '/Copilot_20251220_062127.png';
            return [src, (newSrc: string) => { (window as any).__INITIAL_LOGO_SRC__ = newSrc; }];
          })();
          return (
            <a href="https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/" target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: 8, left: 8, zIndex: 99999 }}>
              <img
                src={imgSrc}
                onError={(e) => { const img = e.currentTarget as HTMLImageElement; img.onerror = null; img.src = '/favicon-32.png'; }}
                alt="Open Live Playtest"
                width={36}
                height={36}
                style={{ display: 'block', borderRadius: 6, boxShadow: '0 6px 14px rgba(0,0,0,0.5)' }}
              />
            </a>
          );
        })()
      }
      
      <KeyboardControls map={controls}>
        <Canvas
          shadows
          camera={{
            position: [0, 4, 6],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance"
          }}
        >
          <color attach="background" args={["#0f0f1e"]} />
          
          <Suspense fallback={null}>
            <GameScene joystickInput={joystickInput} />
          </Suspense>
        </Canvas>
        
        <GameUI />
        <WinScreen />
        <AdRewardScreen />
        <AudioManager />
        
        {/* Touch Controls - only show when joystick is enabled on mobile during gameplay */}
        {isMobile && joystickEnabled && phase === "playing" && (
          <TouchControls onInput={handleJoystickInput} />
        )}
      </KeyboardControls>
    </div>
  );
}

export default App;
