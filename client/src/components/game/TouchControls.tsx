import { useRef, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";

export interface TouchInput {
  x: number; // -1 to 1
  y: number; // -1 to 1
}

interface TouchControlsProps {
  onInput: (input: TouchInput) => void;
  onCatch?: () => void;
}

export function TouchControls({ onInput }: TouchControlsProps) {
  const isMobile = useIsMobile();
  const joystickRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 });
  
  // Responsive joystick sizing - smaller on phones, larger on tablets
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;
  const joystickSize = isSmallScreen ? 100 : 140;
  const stickSize = isSmallScreen ? 40 : 60;
  const maxDistance = (joystickSize - stickSize) / 2;
  
  useEffect(() => {
    if (!isMobile) return;
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !joystickRef.current) return;
      
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const clampedDistance = Math.min(distance, maxDistance);
      const angle = Math.atan2(deltaY, deltaX);
      
      const x = Math.cos(angle) * clampedDistance;
      const y = Math.sin(angle) * clampedDistance;
      
      setStickPosition({ x, y });
      
      // Normalize input to -1 to 1 range
      const normalizedX = x / maxDistance;
      const normalizedY = y / maxDistance;
      
      onInput({ x: normalizedX, y: normalizedY });
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      setStickPosition({ x: 0, y: 0 });
      onInput({ x: 0, y: 0 });
    };
    
    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
      window.addEventListener("touchcancel", handleTouchEnd);
    }
    
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isDragging, isMobile, maxDistance, onInput]);
  
  if (!isMobile) return null;
  
  return (
    <>
      {/* Movement Joystick - Compact on phones */}
      <div className="absolute bottom-16 sm:bottom-20 left-2 sm:left-4 pointer-events-auto">
        <div
          ref={joystickRef}
          className="relative bg-black/40 rounded-full border-4 border-white/40 backdrop-blur-sm shadow-2xl"
          style={{ 
            width: joystickSize, 
            height: joystickSize,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'none'
          }}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* Joystick base crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-10 bg-white/30 absolute rounded-full" />
            <div className="w-10 h-1 bg-white/30 absolute rounded-full" />
          </div>
          
          {/* Joystick stick */}
          <div
            className="absolute rounded-full shadow-2xl transition-transform"
            style={{
              width: stickSize,
              height: stickSize,
              left: `50%`,
              top: `50%`,
              transform: `translate(calc(-50% + ${stickPosition.x}px), calc(-50% + ${stickPosition.y}px))`,
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-orange-400 border-2 border-white/60" />
          </div>
        </div>
      </div>
    </>
  );
}
