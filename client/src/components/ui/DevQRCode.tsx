 import React from 'react';

// Dev-only QR overlay to quickly open the current app URL on another device
export function DevQRCode() {
  // Detect Vite dev mode at build time
  const isDev = Boolean((import.meta as any)?.env?.DEV);
  if (!isDev) return null;

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    url
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // eslint-disable-next-line no-alert
      alert('Dev URL copied to clipboard: ' + url);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Failed to copy URL to clipboard.');
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    right: '12px',
    bottom: '12px',
    zIndex: 999998,
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 6px 24px rgba(0,0,0,0.6)',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '12px',
    width: 'max-content',
  };

  const imgStyle: React.CSSProperties = {
    width: '150px',
    height: '150px',
    borderRadius: '6px',
    background: 'white',
  };

  const urlStyle: React.CSSProperties = {
    maxWidth: '220px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const hintStyle: React.CSSProperties = {
    fontSize: '11px',
    opacity: 0.85,
    textAlign: 'center',
    maxWidth: '220px',
  };

  return (
    <div style={containerStyle} aria-hidden={false}>
      <img src={qrSrc} alt={`QR for ${url}`} style={imgStyle} />
      <div style={urlStyle}>{url}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleCopy}
          style={{ padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
        >
          Copy URL
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '6px 8px', borderRadius: 6, background: '#111', color: 'white', textDecoration: 'none' }}
        >
          Open
        </a>
      </div>
      <div style={hintStyle}>
        If this URL is localhost, make sure your dev server is bound to 0.0.0.0 and your phone is on the
        same network.
      </div>
    </div>
  );
}

export default DevQRCode;

