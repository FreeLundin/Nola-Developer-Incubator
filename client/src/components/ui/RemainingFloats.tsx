import React from 'react';

interface RemainingFloatsProps {
  remaining: number;
}

export const RemainingFloats: React.FC<RemainingFloatsProps> = ({ remaining }) => {
  return (
    <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 30, pointerEvents: 'none' }}>
      <div style={{ background: 'rgba(0,0,0,0.45)', color: '#fff', padding: '6px 8px', borderRadius: 8 }}>
        <div style={{ fontSize: 13 }}>Floats Remaining: {remaining}</div>
      </div>
    </div>
  );
};

