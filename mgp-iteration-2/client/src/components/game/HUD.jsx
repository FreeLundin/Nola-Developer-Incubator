import React from 'react'
import { useStore } from '../../store/useParadeStore'

export function HUD(){
  const flip = useStore(s=>s.flipControls)
  const sensitivity = useStore(s=>s.joystickSensitivity)
  const coach = useStore(s=>s.coachMode)
  const handedness = useStore(s=>s.handedness)

  return (
    <div className="hud">
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <div className="label">Controls</div>
        <label style={{display:'flex',alignItems:'center',gap:8}}>
          <input type="checkbox" checked={flip} onChange={(e)=>useStore.getState().setFlipControls(e.target.checked)} /> Flip X
        </label>
        <label style={{display:'flex',alignItems:'center',gap:8}}>
          <div className="label">Handedness</div>
          <select value={handedness} onChange={(e)=>useStore.getState().setHandedness(e.target.value)}>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </label>
        <div className="label">Sensitivity</div>
        <input className="slider" type="range" min="0.5" max="1.8" step="0.05" value={sensitivity} onChange={(e)=>useStore.getState().setJoystickSensitivity(Number(e.target.value))} />
        <label style={{display:'flex',alignItems:'center',gap:8}}>
          <input type="checkbox" checked={coach} onChange={(e)=>useStore.getState().setCoachMode(e.target.checked)} /> Coach Mode
        </label>
      </div>
    </div>
  )
}

export default HUD
