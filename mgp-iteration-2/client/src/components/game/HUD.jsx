import React from 'react'
import { useStore } from '../../store/useParadeStore'

export function HUD(){
  const flip = useStore(s=>s.flipControls)
  const sensitivity = useStore(s=>s.joystickSensitivity)
  const coach = useStore(s=>s.coachMode)
  const handedness = useStore(s=>s.handedness)
  const floatsCount = useStore(s => s.floatsCount)

  const isSmall = typeof window !== 'undefined' && window.innerWidth < 640

  return (
    <div className="hud" style={{minWidth: isSmall ? 120 : undefined}}>
      <div style={{display:'flex',flexDirection:isSmall ? 'row' : 'column',gap:8,alignItems:isSmall ? 'center' : 'stretch'}}>
        {isSmall ? (
          <>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
              <div className="label">Floats</div>
              <div style={{fontWeight:700,fontSize:16}}>{floatsCount}</div>
            </div>
            <div style={{marginLeft:12}}>
              <label style={{display:'flex',alignItems:'center',gap:6}}>
                <input type="checkbox" checked={flip} onChange={(e)=>useStore.getState().setFlipControls(e.target.checked)} />
                Flip
              </label>
            </div>
          </>
        ) : (
          <>
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
            <div style={{marginTop:8}}>
              <div className="label">Floats</div>
              <div style={{fontWeight:700,fontSize:16}}>{floatsCount}</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HUD
