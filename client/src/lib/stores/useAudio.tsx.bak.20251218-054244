import { create } from "zustand";
import { Howl, Howler } from "howler";

interface HowlHandles {
  background?: Howl | null;
  hit?: Howl | null;
  success?: Howl | null;
}

interface AudioState {
  howls: HowlHandles;
  isMuted: boolean;
  setHowls: (handles: HowlHandles) => void;
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playFireworks: () => void;
  unlockAudio: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  howls: { background: null, hit: null, success: null },
  isMuted: true,
  setHowls: (handles) => {
    // Apply mute state immediately
    const { isMuted } = get();
    if (handles.background) handles.background.mute(isMuted);
    if (handles.hit) handles.hit.mute(isMuted);
    if (handles.success) handles.success.mute(isMuted);
    set({ howls: handles });
  },
  toggleMute: () => {
    const { isMuted, howls } = get();
    const newMuted = !isMuted;
    // Global Howler mute also available
    Howler.mute(newMuted);
    set({ isMuted: newMuted });
    console.log(`Sound ${newMuted ? 'muted' : 'unmuted'}`);
  },
  playHit: () => {
    const { howls, isMuted } = get();
    if (isMuted) return console.log('Hit skipped (muted)');
    if (howls.hit) howls.hit.play();
  },
  playSuccess: () => {
    const { howls, isMuted } = get();
    if (isMuted) return console.log('Success skipped (muted)');
    if (howls.success) howls.success.play();
  },
  playFireworks: () => {
    const { howls, isMuted } = get();
    if (isMuted) return console.log('Fireworks skipped (muted)');
    if (howls.success) howls.success.play();
  },
  unlockAudio: () => {
    // With Howler, a user gesture will make audio playable; we can resume audio context
    try {
      if ((Howler as any).ctx && (Howler as any).ctx.state === 'suspended') {
        (Howler as any).ctx.resume().catch(() => {});
      }
      // Try a short play of SFX to unlock
      const { howls } = get();
      if (howls.hit) howls.hit.play();
      if (howls.success) howls.success.play();
      // Expose debug flag for automated tests
      try { (window as any).__audioUnlocked = true; } catch (e) {}
      console.log('Attempted to unlock Howler audio via user gesture');
    } catch (err) {
      console.log('unlockAudio failed', err);
    }
  }
}));
