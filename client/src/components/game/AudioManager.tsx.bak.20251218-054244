import { useEffect } from "react";
import { Howl } from "howler";
import { useAudio } from "@/lib/stores/useAudio";
import { useParadeGame } from "@/lib/stores/useParadeGame";

export function AudioManager() {
  const { isMuted, setHowls } = useAudio();
  const { phase } = useParadeGame();
  
  useEffect(() => {
    // Initialize Howl instances
    const bg = new Howl({ src: ['/sounds/background.mp3'], loop: true, volume: 0.3 });
    const hit = new Howl({ src: ['/sounds/hit.mp3'], volume: 0.3 });
    const success = new Howl({ src: ['/sounds/success.mp3'], volume: 0.5 });

    setHowls({ background: bg, hit, success });

    // Unlock audio on first gesture
    const onFirstGesture = () => {
      const { unlockAudio } = useAudio.getState();
      unlockAudio();
      window.removeEventListener('click', onFirstGesture);
      window.removeEventListener('touchstart', onFirstGesture);
    };
    window.addEventListener('click', onFirstGesture);
    window.addEventListener('touchstart', onFirstGesture);

    return () => {
      bg.unload();
      hit.unload();
      success.unload();
      window.removeEventListener('click', onFirstGesture);
      window.removeEventListener('touchstart', onFirstGesture);
    };
  }, []);
  
  // Handle background music based on game phase
  useEffect(() => {
    const { howls } = useAudio.getState();
    if (!howls.background) return;

    if (phase === 'playing' && !isMuted) {
      try { howls.background.play(); } catch (e) { console.log('bg play prevented', e); }
    } else {
      try { howls.background.pause(); } catch (e) { /* ignore */ }
    }
  }, [phase, isMuted]);
  
  return null;
}
