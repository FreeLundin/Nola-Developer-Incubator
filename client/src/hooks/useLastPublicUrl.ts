import { useEffect, useState, useRef } from 'react';

interface LastPublicUrlState {
  url: string | null;
  loading: boolean;
  error?: string;
}

const POLL_INTERVAL_MS = 5000;

export default function useLastPublicUrl(): LastPublicUrlState {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const mounted = useRef(true);

  const fetchUrl = async () => {
    try {
      const res = await fetch('/api/last-public-url');
      if (!mounted.current) return;
      if (!res.ok) {
        setError(`HTTP ${res.status}`);
        setUrl(null);
        return;
      }
      const body = await res.json();
      if (!mounted.current) return;
      setUrl(body?.url || null);
      setError(undefined);
    } catch (e: any) {
      if (!mounted.current) return;
      setError(String(e?.message || e));
      setUrl(null);
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchUrl();
    const id = setInterval(fetchUrl, POLL_INTERVAL_MS);
    return () => { mounted.current = false; clearInterval(id); };
  }, []);

  return { url, loading, error };
}
