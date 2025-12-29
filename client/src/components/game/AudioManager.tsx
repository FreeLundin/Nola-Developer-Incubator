import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { Howl } from 'howler';

function getAssetBase() {
  const env = (import.meta as any).env || {};
  const base = env.VITE_ASSET_BASE_URL ?? env.BASE_URL ?? '';
  return String(base || '');
}

function joinAsset(base: string, path: string) {
  const b = base ? String(base).replace(/\/+$|\\s+$/g, '') : '';
  const p = String(path).replace(/^\/+/, '');
  if (!b) return `/${p}`; // preserve original leading slash behavior
  return `${b.replace(/\/$/, '')}/${p}`;
}

export function AudioManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound, isMuted } = useAudio();
  const { phase } = useParadeGame();

  useEffect(() => {
    const assetBase = getAssetBase();
    const bgPath = joinAsset(assetBase, 'sounds/background.mp3');
    const hitPath = joinAsset(assetBase, 'sounds/hit.mp3');
    const successPath = joinAsset(assetBase, 'sounds/success.mp3');

    const bg = new Howl({ src: [bgPath], loop: true, volume: 0.3 });
    const hit = new Howl({ src: [hitPath], volume: 0.3 });
    const success = new Howl({ src: [successPath], volume: 0.5 });

    setBackgroundMusic(bg);
    setHitSound(hit);
    setSuccessSound(success);

    // try to unlock audio by playing a short silent buffer on user gesture
    const unlock = () => {
      try {
        bg.once('play', () => {});
        if (!isMuted) {
          bg.play();
          bg.pause();
        }
      } catch (e) {
        console.warn('Attempted to unlock Howler audio via user gesture');
      }
    };

    window.addEventListener('pointerdown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      try { bg.unload(); } catch { /* ignore */ }
      try { hit.unload(); } catch { /* ignore */ }
      try { success.unload(); } catch { /* ignore */ }
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Handle background music based on game phase
  useEffect(() => {
    const { backgroundMusic } = useAudio.getState();
    if (!backgroundMusic) return;

    if (phase === 'playing' && !isMuted) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  }, [phase, isMuted]);

  return null;
}
