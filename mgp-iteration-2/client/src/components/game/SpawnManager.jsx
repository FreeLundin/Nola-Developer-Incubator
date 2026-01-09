import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { computeAvoidance } from '../../ai/avoidance'
import { useStore } from '../../store/useParadeStore'

// Simple spawn manager placeholder: spawns float positions and exposes them for avoidance
export function SpawnManager(){
  const floatsRef = useRef([])
  const [floats, setFloats] = useState(floatsRef.current)
  const playerPosRef = useRef({x:0,z:0})

  useEffect(()=>{
    const interval = setInterval(()=>{
      const floats = floatsRef.current
      if(Math.random() < 0.02 && floats.length < 20){
        floats.push({ x: (Math.random() - 0.5) * 12, z: (Math.random() - 0.5) * 30, id: Date.now()+Math.random() })
      }
      if(floats.length > 40) floats.splice(0, floats.length - 40)
    }, 500)
    return ()=> clearInterval(interval)
  }, [])

  useFrame(()=>{
    const floats = floatsRef.current
    const playerPos = useStore.getState().playerPosition || { x:0, z:0 }
    playerPosRef.current = playerPos
    for(const f of floats){
      const avoid = computeAvoidance(playerPosRef.current, [f], 1.2)
      f.x += (avoid.x * 0.02) + (Math.random() - 0.5) * 0.01
      f.z += (avoid.z * 0.02) + (Math.random() - 0.5) * 0.01
    }
    // throttle UI updates to ~5/sec and update debug DOM
    const now = performance.now()
    if(!SpawnManager._lastUpdate || now - SpawnManager._lastUpdate > 180){
      SpawnManager._lastUpdate = now
      setFloats([...floatsRef.current])
      // update debug DOM element attached to document.body
      try{
        const el = document.getElementById('mgp-debug') || (() => {
          const d = document.createElement('div')
          d.id = 'mgp-debug'
          d.style.display = 'none'
          document.body.appendChild(d)
          return d
        })()
        el.setAttribute('data-json', JSON.stringify({ floatsCount: floatsRef.current.length, player: playerPosRef.current }))
      }catch(e){}
    }
  })

  return (
    <group>
      {floats.map(f => (
        <mesh key={f.id} position={[f.x, 0.25, f.z]}>
          <sphereGeometry args={[0.28, 8, 8]} />
          <meshStandardMaterial color={'#f97316'} emissive={'#f97316'} emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  )
}

export default SpawnManager
