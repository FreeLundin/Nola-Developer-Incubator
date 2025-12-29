import React from 'react';

interface MinimalHUDProps {
  floatsRemaining: number;
  score: number;
}

export const MinimalHUD: React.FC<MinimalHUDProps> = ({ floatsRemaining, score }) => {
  return (
    <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 30, pointerEvents: 'none' }}>
      <div style={{ background: 'rgba(0,0,0,0.5)', color: 'white', padding: '6px 10px', borderRadius: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Score: {score}</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>Floats: {floatsRemaining}</div>
      </div>
    </div>
  );
};

