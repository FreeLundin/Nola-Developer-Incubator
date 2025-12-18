import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useCallback, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import { GameScene } from "./components/game/GameScene";
import { GameUI } from "./components/game/GameUI";
import { WinScreen } from "./components/game/WinScreen";
import { AudioManager } from "./components/game/AudioManager";
import { AdRewardScreen } from "./components/game/AdRewardScreen";
import { TouchControls, TouchInput } from "./components/game/TouchControls";
import { Controls, JoystickInput } from "./components/game/Player";
import { useParadeGame } from "./lib/stores/useParadeGame";
import { useIsMobile } from "./hooks/use-is-mobile";
import { CanvasGuard } from "./components/game/CanvasGuard";
import { DevPerf } from "./components/game/DevPerf";
import DevQRCode from "./components/ui/DevQRCode";

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

  // Detect Vite dev mode safely
  const DEV_LOW_DETAIL = (() => {
    try {
      return Boolean((import.meta as any)?.env?.DEV);
    } catch {
      return false;
    }
  })();

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
        <Canvas
          shadows={!DEV_LOW_DETAIL}
          camera={{
            position: [0, 4, 6],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: !DEV_LOW_DETAIL,
            powerPreference: DEV_LOW_DETAIL ? 'low-power' : 'high-performance'
          }}
          dpr={DEV_LOW_DETAIL ? [1, 1] : [1, 2]}
        >
          <color attach="background" args={["#0f0f1e"]} />

          <Suspense fallback={null}>
            <GameScene joystickInput={joystickInput} />
          </Suspense>

          {/* CanvasGuard listens for WebGL context lost/restore and shows overlay */}
          <CanvasGuard />

          {/* Dev performance overlay (dev-only) */}
          {DEV_LOW_DETAIL && <DevPerf />}
          {/* Dev QR overlay to scan and open app on another device */}
          <DevQRCode />
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
