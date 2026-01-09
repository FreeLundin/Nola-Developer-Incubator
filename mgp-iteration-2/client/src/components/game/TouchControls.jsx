import React, { useRef, useState, useEffect } from 'react'
import { useStore } from '../../store/useParadeStore'

export function TouchControls({ onInput }){
  const joystickRef = useRef(null)
  const [dragging,setDragging] = useState(false)
  const [pos,setPos] = useState({x:0,y:0})
  const sensitivity = useStore(s => s.joystickSensitivity)
  const flip = useStore(s => s.flipControls)
  const handedness = useStore(s => s.handedness)

  const size = typeof window !== 'undefined' && window.innerWidth < 640 ? 110 : 150
  const stick = size * 0.42
  const maxDist = (size - stick) / 2

  const last = useRef({x:0,y:0})
  const alpha = 0.22

  const update = (clientX, clientY) => {
    if(!joystickRef.current) return
    const rect = joystickRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width/2
    const cy = rect.top + rect.height/2
    let dx = clientX - cx
    let dy = clientY - cy
    const dist = Math.hypot(dx,dy)
    const clamped = Math.min(dist, maxDist)
    const ang = Math.atan2(dy,dx)
    const x = Math.cos(ang) * clamped
    const y = Math.sin(ang) * clamped

    let nx = (x / maxDist) * sensitivity
    let ny = (y / maxDist) * sensitivity
    if(flip) nx = -nx

    // low-pass smoothing
    last.current.x = last.current.x + (nx - last.current.x) * alpha
    last.current.y = last.current.y + (ny - last.current.y) * alpha

    setPos({x:last.current.x * maxDist, y:last.current.y * maxDist})
    const out = { x: Number(Math.max(-1,Math.min(1,last.current.x)).toFixed(3)), y: Number(Math.max(-1,Math.min(1,last.current.y)).toFixed(3)) }
    onInput && onInput(out)
  }

  useEffect(()=>{
    const onMove = (e) => { if(!dragging) return; update(e.clientX,e.clientY) }
    const onEnd = () => { setDragging(false); last.current={x:0,y:0}; setPos({x:0,y:0}); onInput && onInput({x:0,y:0}) }
    if(dragging){ window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onEnd); window.addEventListener('pointercancel', onEnd) }
    return ()=>{ window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onEnd); window.removeEventListener('pointercancel', onEnd) }
  },[dragging])

  const baseStyle = {position:'absolute', bottom:20, left: handedness === 'left' ? 12 : 'unset', right: handedness === 'right' ? 12 : 'unset', width:size, height:size, borderRadius:'50%', background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', touchAction:'none'}
  const stickStyle = {width:stick, height:stick, borderRadius:'50%', transform:`translate(${pos.x}px, ${pos.y}px)`, transition: dragging ? 'none' : 'transform 220ms ease-out', background:'linear-gradient(135deg,#7c3aed,#fb923c)', boxShadow:'0 6px 18px rgba(0,0,0,0.35)'}

  return (
    <div ref={joystickRef} style={baseStyle}
      onPointerDown={(e)=>{ if(e.isPrimary===false) return; joystickRef.current.setPointerCapture?.(e.pointerId); setDragging(true); update(e.clientX,e.clientY) }}
    >
      <div style={{position:'absolute', width:'60%', height:4, background:'rgba(255,255,255,0.12)', borderRadius:4, transform:'translateY(-50%)'}} />
      <div style={{position:'absolute', height:'60%', width:4, background:'rgba(255,255,255,0.12)', borderRadius:4, transform:'translateX(-50%)'}} />
      <div style={stickStyle} />
    </div>
  )
}

export default TouchControls
