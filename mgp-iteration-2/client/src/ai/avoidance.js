export function computeAvoidance(playerPos, floats, radius=2.0){
  let steer = {x:0,z:0}
  for(const f of floats){
    const dx = playerPos.x - f.x
    const dz = playerPos.z - f.z
    const d2 = dx*dx + dz*dz
    if(d2 === 0) continue
    const dist = Math.sqrt(d2)
    if(dist < radius){
      const strength = (radius - dist) / radius
      steer.x += (dx/dist) * strength
      steer.z += (dz/dist) * strength
    }
  }
  const mag = Math.sqrt(steer.x*steer.x + steer.z*steer.z)
  if(mag > 0){ steer.x /= mag; steer.z /= mag }
  return steer
}
