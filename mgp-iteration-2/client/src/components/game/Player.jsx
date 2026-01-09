import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useParadeStore'

export function Player(){
  const meshRef = useRef()
  const pos = useRef(new THREE.Vector3(0,0.5,0))
  const vel = useRef(new THREE.Vector3())
  const dir = useRef(new THREE.Vector3())

  const baseSpeed = 4.2
  const rotationSpeed = 8.0
  const deadzone = 0.08
  const smoothing = 0.18

  useFrame((state,delta)=>{
    const joystick = useStore.getState().joystickInput || {x:0,y:0}
    const flip = useStore.getState().flipControls
    const sensitivity = useStore.getState().joystickSensitivity
    const coach = useStore.getState().coachMode

    let moveX = joystick.x || 0
    let moveZ = joystick.y || 0

    if(flip) moveX = -moveX
    moveX *= sensitivity
    moveZ *= sensitivity

    if(Math.abs(moveX) < deadzone) moveX = 0
    if(Math.abs(moveZ) < deadzone) moveZ = 0

    const isMoving = moveX !== 0 || moveZ !== 0

    if(isMoving){
      dir.current.set(moveX,0,moveZ).normalize()
      vel.current.lerp(dir.current.clone().multiplyScalar(baseSpeed * (coach?0.75:1)), smoothing)
      pos.current.addScaledVector(vel.current, delta)
      const target = Math.atan2(moveX, moveZ)
      if(meshRef.current) meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, target, rotationSpeed * delta)
    }else{
      vel.current.multiplyScalar(0.9)
      pos.current.addScaledVector(vel.current, delta)
    }

    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -6.5, 6.5)
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -15, 15)

    if(meshRef.current) meshRef.current.position.copy(pos.current)
  })

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.32,1.0,6,12]} />
        <meshStandardMaterial color={'#9b59b6'} metalness={0.18} roughness={0.45} />
      </mesh>
      <mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]}>
        <circleGeometry args={[0.45, 16]} />
        <meshBasicMaterial color={'#000000'} transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

export default Player
