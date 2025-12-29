import React, { useState, useEffect } from 'react';
import { useParadeGame } from '../../lib/stores/useParadeGame';

export default function DevOverlay(): JSX.Element {
  const phase = useParadeGame((s) => s.phase);
  const score = useParadeGame((s) => s.score);
  const level = useParadeGame((s) => s.level);
  const coins = useParadeGame((s) => s.coins);
  const joystickEnabled = useParadeGame((s) => s.joystickEnabled);

  const startGame = useParadeGame((s) => s.startGame);
  const resetGame = useParadeGame((s) => s.resetGame);
  const toggleJoystick = useParadeGame((s) => s.toggleJoystick);
  const addCoins = useParadeGame((s) => s.addCoins);

  // Minimal HUD toggle stored in localStorage so GameUI can read it
  const [minimalHud, setMinimalHud] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('minimalHud') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try { if (typeof window !== 'undefined') localStorage.setItem('minimalHud', String(minimalHud)); } catch { }
    // Dispatch custom event so the page can respond without needing to reload
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('minimalHud:updated'));
    }
  }, [minimalHud]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: 10,
        borderRadius: 8,
        fontSize: 12,
        zIndex: 9999,
        minWidth: 160,
      }}
      aria-hidden
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Dev Overlay</div>
      <div style={{ marginBottom: 6 }}>
        <div>Phase: {phase}</div>
        <div>Score: {score}</div>
        <div>Level: {level}</div>
        <div>Coins: {coins}</div>
        <div>Joystick: {joystickEnabled ? 'on' : 'off'}</div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          onClick={() => startGame()}
          style={{ padding: '6px 8px', cursor: 'pointer' }}
        >
          Start
        </button>

        <button
          onClick={() => resetGame()}
          style={{ padding: '6px 8px', cursor: 'pointer' }}
        >
          Reset
        </button>

        <button
          onClick={() => toggleJoystick()}
          style={{ padding: '6px 8px', cursor: 'pointer' }}
        >
          Toggle Joystick
        </button>

        <button
          onClick={() => addCoins(10)}
          style={{ padding: '6px 8px', cursor: 'pointer' }}
        >
          +10 Coins
        </button>

        <button
          onClick={() => setMinimalHud((v) => !v)}
          style={{ padding: '6px 8px', cursor: 'pointer' }}
        >
          {minimalHud ? 'Disable Minimal HUD' : 'Enable Minimal HUD'}
        </button>
      </div>

      <div style={{ marginTop: 8, fontSize: 11, opacity: 0.8 }}>
        This panel is development-only. No production impact.
      </div>
    </div>
  );
}
