import { useState, useEffect, useCallback } from 'react';
// Import bundled bot config (Vite/ESM-friendly)
// eslint-disable-next-line @typescript-eslint/no-var-requires
import bundledBots from '@/config/bots.json';

export function getRuntimeBotsConfig(): Array<any> {
  if (typeof window !== 'undefined') {
    try {
      const override = localStorage.getItem('bots.override');
      if (override) {
        const parsed = JSON.parse(override);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to read bots.override from localStorage', e);
    }
  }
  return bundledBots as Array<any>;
}

export function useBotsConfig() {
  const [bots, setBots] = useState<Array<any>>(() => getRuntimeBotsConfig());

  const reload = useCallback(() => {
    const cfg = getRuntimeBotsConfig();
    setBots(cfg);
  }, []);

  useEffect(() => {
    const handler = () => reload();
    window.addEventListener('bots:updated', handler);
    return () => window.removeEventListener('bots:updated', handler);
  }, [reload]);

  return { bots, reload };
}
