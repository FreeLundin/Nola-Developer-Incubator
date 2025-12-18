import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useParadeGame } from "@/lib/stores/useParadeGame";

export function AudioManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound, isMuted } = useAudio();
  const { phase } = useParadeGame();
  
  useEffect(() => {
    // Initialize audio elements
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.3;
    
    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.5;
    
    setBackgroundMusic(bgMusic);
    setHitSound(hit);
    setSuccessSound(success);
    
    return () => {
      bgMusic.pause();
      hit.pause();
      success.pause();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);
  
  // Handle background music based on game phase
  useEffect(() => {
    // Get the stored background music from the audio store
    const { backgroundMusic } = useAudio.getState();
    if (!backgroundMusic) return;
    
    if (phase === "playing" && !isMuted) {
      backgroundMusic.play().catch((error) => {
        console.log("Background music autoplay prevented (requires user interaction):", error);
      });
    } else {
      backgroundMusic.pause();
    }
  }, [phase, isMuted]);
  
  return null;
}
