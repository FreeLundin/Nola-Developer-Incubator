import React, { useState } from 'react'
import { useStore } from '../../store/useParadeStore'

export function Tutorial(){
  const [visible,setVisible] = useState(true)
  const coach = useStore(s=>s.coachMode)

  if(!visible) return null

  return (
    <div style={{position:'absolute',left:12,top:12,background:'rgba(0,0,0,0.6)',padding:12,borderRadius:8,maxWidth:320}}>
      <div style={{fontWeight:700}}>Quick Tips</div>
      <div style={{fontSize:13,marginTop:8}}>
        - Use the thumbstick to move left/right and forward.<br/>
        - Toggle <b>Flip X</b> or change <b>Handedness</b> in the HUD for comfort.<br/>
        - <b>Coach Mode</b> slightly reduces speed and gives more forgiving movement.
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
        <button onClick={()=>setVisible(false)}>Close</button>
      </div>
    </div>
  )
}

export default Tutorial
