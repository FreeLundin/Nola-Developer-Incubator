import create from 'zustand'

export const useStore = create((set,get) => ({
  joystickEnabled: true,
  flipControls: false,
  joystickSensitivity: 1.0,
  joystickInput: { x:0, y:0 },
  handedness: 'left', // 'left' or 'right'
  coachMode: false,

  setJoystickEnabled: (v) => set({ joystickEnabled: v }),
  setFlipControls: (v) => set({ flipControls: v }),
  setJoystickSensitivity: (v) => set({ joystickSensitivity: v }),
  setJoystickInput: (i) => set({ joystickInput: i }),
  setHandedness: (h) => set({ handedness: h }),
  setCoachMode: (v) => set({ coachMode: v }),

  getMoveSpeedMultiplier: () => (get().coachMode ? 0.8 : 1.0)
}))

export default useStore
