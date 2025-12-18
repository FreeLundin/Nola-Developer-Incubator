import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import useLastPublicUrl from '../../hooks/useLastPublicUrl';

export interface ShareButtonProps {
  className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
  const { url, loading } = useLastPublicUrl();

  const handleOpen = useCallback(() => {
    if (!url) return;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      // fallback: copy to clipboard
      try { navigator.clipboard.writeText(url); alert('URL copied to clipboard'); } catch { window.prompt('Copy this URL', url); }
    }
  }, [url]);

  const handleCopy = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      // small non-intrusive feedback
      // Using alert for simplicity; project can replace with toast
      alert('Playtest URL copied to clipboard');
    } catch (e) {
      window.prompt('Copy this URL', url);
    }
  }, [url]);

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Button size="sm" onClick={handleOpen} disabled={!url || loading} className="bg-green-700 hover:bg-green-600 text-white">
        <Share2 size={14} className="inline-block mr-1" /> Share
      </Button>
      <Button size="sm" onClick={handleCopy} disabled={!url || loading} className="bg-gray-700 hover:bg-gray-600 text-white">
        <Copy size={14} className="inline-block mr-1" /> Copy
      </Button>
    </div>
  );
}

export default ShareButton;
