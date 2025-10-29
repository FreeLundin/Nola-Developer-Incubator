import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import { GameScene } from "./components/game/GameScene";
import { GameUI } from "./components/game/GameUI";
import { WinScreen } from "./components/game/WinScreen";
import { AudioManager } from "./components/game/AudioManager";
import { AdRewardScreen } from "./components/game/AdRewardScreen";
import { TouchControls, type TouchInput } from "./components/game/TouchControls";
import { Controls } from "./components/game/Player";

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.back, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
];

function App() {
  const [touchInput, setTouchInput] = useState<TouchInput>({ x: 0, y: 0 });
  const [catchAction, setCatchAction] = useState(0);
  
  const handleTouchInput = (input: TouchInput) => {
    setTouchInput(input);
  };
  
  const handleCatchPress = () => {
    setCatchAction(prev => prev + 1);
  };
  
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
            <GameScene touchInput={touchInput} catchAction={catchAction} />
          </Suspense>
        </Canvas>
        
        <GameUI />
        <WinScreen />
        <AdRewardScreen />
        <TouchControls onInput={handleTouchInput} onCatch={handleCatchPress} />
        <AudioManager />
      </KeyboardControls>
    </div>
  );
}

export default App;
