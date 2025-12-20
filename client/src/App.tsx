import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useCallback, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
// SpeedInsights is optional; dynamically import it so builds don't fail if the package isn't installed
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
  const [SpeedInsightsComp, setSpeedInsightsComp] = useState<React.ComponentType | null>(null);
  
  const handleJoystickInput = useCallback((input: TouchInput) => {
    setJoystickInput({ x: input.x, y: input.y });
  }, []);
  
  // Clear joystick input when joystick is disabled or gameplay ends
  useEffect(() => {
    if (!joystickEnabled || phase !== "playing") {
      setJoystickInput(null);
    }
  }, [joystickEnabled, phase]);
  
  // Try to dynamically import SpeedInsights if available; ignore failures
  useEffect(() => {
    let mounted = true;
    // Use a runtime variable so Vite doesn't try to statically resolve this optional package
    const pkg = '@vercel/speed-insights/react';
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    import(pkg as any)
      .then((m: any) => {
        if (mounted && (m.SpeedInsights || m.default)) {
          setSpeedInsightsComp(() => m.SpeedInsights || m.default);
        }
      })
      .catch(() => {
        // optional dependency not present - silently ignore
      });
    return () => { mounted = false; };
  }, []);
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
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
      {SpeedInsightsComp && <SpeedInsightsComp />}
    </div>
  );
}

export default App;
