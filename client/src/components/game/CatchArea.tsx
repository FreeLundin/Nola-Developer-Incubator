import React from 'react';
import { useParadeGame } from '@/lib/stores/useParadeGame';

export function CatchArea() {
  const markCatch = useParadeGame((s) => s.addCatch);

  const handleTap = (e: React.PointerEvent) => {
    // simple tap handler: trigger addCatch without type (game will compute)
    markCatch();
  };

  return (
    <div
      className="absolute inset-0 right-0 pointer-events-auto"
      style={{ width: '45vw', right: 0, left: '55vw', bottom: 0, top: 0 }}
      onPointerDown={handleTap}
    />
  );
}

