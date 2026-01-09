import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { computeAvoidance } from '../ai/avoidance'

// Simple spawn manager placeholder: spawns float positions and exposes them for avoidance
export function SpawnManager(){
  const floatsRef = useRef([])
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
    for(const f of floats){
      const avoid = computeAvoidance(playerPosRef.current, [f], 1.2)
      f.x += (avoid.x * 0.02) + (Math.random() - 0.5) * 0.01
      f.z += (avoid.z * 0.02) + (Math.random() - 0.5) * 0.01
    }
  })

  return null
}

export default SpawnManager
