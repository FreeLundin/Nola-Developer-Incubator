import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Player } from './components/game/Player'
import { TouchControls } from './components/game/TouchControls'
import { HUD } from './components/game/HUD'
import { SpawnManager } from './components/game/SpawnManager'
import { Tutorial } from './components/game/Tutorial'
import { useStore } from './store/useParadeStore'

export default function App(){
  const joystickEnabled = useStore(s => s.joystickEnabled)
  return (
    <div style={{width:'100vw',height:'100vh',position:'relative',overflow:'hidden'}}>
      <Canvas camera={{position:[0,4,6],fov:60}}>
        <color attach="background" args={["#081026"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5,10,5]} intensity={0.6} />
        <Suspense fallback={null}>
          <Player />
          <SpawnManager />
        </Suspense>
      </Canvas>

      <HUD />
      <Tutorial />

      {joystickEnabled && <TouchControls onInput={(i)=>useStore.getState().setJoystickInput(i)} />}
    </div>
  )
}
