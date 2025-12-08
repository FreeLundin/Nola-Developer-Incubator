import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * DevPerf: lightweight FPS counter for development builds.
 * Uses useFrame to sample frame times and renders a small DOM overlay.
 */
export function DevPerf() {
  const [fps, setFps] = useState(0);
  const [ms, setMs] = useState(0);
  const samples = 20;
  const times: number[] = [];

  useFrame((state, delta) => {
    times.push(delta * 1000);
    if (times.length > samples) times.shift();
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    setMs(avg);
    setFps(Math.round(1000 / Math.max(1, avg)));
  });

  useEffect(() => {
    const el = document.createElement('div');
    el.id = 'dev-perf-overlay';
    el.style.position = 'fixed';
    el.style.right = '12px';
    el.style.top = '12px';
    el.style.zIndex = '999999';
    el.style.background = 'rgba(0,0,0,0.6)';
    el.style.color = '#fff';
    el.style.padding = '6px 10px';
    el.style.borderRadius = '6px';
    el.style.fontFamily = 'monospace';
    el.style.fontSize = '12px';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);

    return () => {
      const e = document.getElementById('dev-perf-overlay');
      if (e && e.parentNode) e.parentNode.removeChild(e);
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById('dev-perf-overlay');
    if (el) {
      el.textContent = `FPS: ${fps} | ${ms.toFixed(1)} ms`;
    }
  }, [fps, ms]);

  return null;
}

