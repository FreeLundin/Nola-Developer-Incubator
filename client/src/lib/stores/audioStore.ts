import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioStore {
  muted: boolean;
  setMuted: (m: boolean) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      muted: false,
      setMuted: (m: boolean) => set({ muted: m }),
    }),
    {
      name: 'audio-storage',
      getStorage: () => localStorage,
    }
  )
);

