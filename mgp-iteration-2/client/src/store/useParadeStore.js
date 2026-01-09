import create from 'zustand'

export const useStore = create((set,get) => ({
  joystickEnabled: true,
  flipControls: false,
  joystickSensitivity: 1.0,
  joystickInput: { x:0, y:0 },
  handedness: 'left', // 'left' or 'right'
  coachMode: false,
  playerPosition: { x: 0, z: 0 },
  tutorialStep: 0,
  floatsCount: 0,
  inventory: [],

  setJoystickEnabled: (v) => set({ joystickEnabled: v }),
  setFlipControls: (v) => set({ flipControls: v }),
  setJoystickSensitivity: (v) => set({ joystickSensitivity: v }),
  setJoystickInput: (i) => set({ joystickInput: i }),
  setHandedness: (h) => set({ handedness: h }),
  setCoachMode: (v) => set({ coachMode: v }),
  setPlayerPosition: (p) => set({ playerPosition: p }),
  setTutorialStep: (s) => set({ tutorialStep: s }),
  setFloatsCount: (n) => set({ floatsCount: n }),
  addToInventory: (item) => set(state => ({ inventory: [...state.inventory, item] })),

  getMoveSpeedMultiplier: () => (get().coachMode ? 0.8 : 1.0)
}))

export default useStore
