import { create } from "zustand";
import { Howl, Howler } from 'howler';

interface AudioState {
  backgroundMusic: Howl | null;
  hitSound: Howl | null;
  successSound: Howl | null;
  isMuted: boolean;

  // Setter functions
  setBackgroundMusic: (music: Howl) => void;
  setHitSound: (sound: Howl) => void;
  setSuccessSound: (sound: Howl) => void;

  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playFireworks: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: typeof window !== 'undefined' ? (localStorage.getItem('isMuted') === 'true') : true,

  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),

  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;

    // Apply Howler global mute
    try { Howler.mute(newMutedState); } catch (e) { /* ignore */ }

    set({ isMuted: newMutedState });
    try { if (typeof window !== 'undefined') localStorage.setItem('isMuted', String(newMutedState)); } catch {}

    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },

  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      if (isMuted) {
        console.log('Hit sound skipped (muted)');
        return;
      }
      try {
        hitSound.volume(0.3);
        hitSound.play();
      } catch (e) {
        console.log('Hit sound play prevented:', e);
      }
    }
  },

  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      if (isMuted) {
        console.log('Success sound skipped (muted)');
        return;
      }
      try {
        successSound.volume(0.5);
        successSound.play();
      } catch (e) {
        console.log('Success sound play prevented:', e);
      }
    }
  },

  playFireworks: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      if (isMuted) {
        console.log('Fireworks sound skipped (muted)');
        return;
      }
      try {
        const s = successSound;
        s.volume(0.6);
        s.play();
      } catch (e) {
        console.log('Fireworks sound play prevented:', e);
      }
    }
  }
}));
