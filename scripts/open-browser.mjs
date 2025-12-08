import http from 'http';
import { exec } from 'child_process';

// Poll /health until ready, then open the default browser to the app URL
const URL = process.env.APP_URL || 'http://127.0.0.1:5000';
const HEALTH = `${URL.replace(/\/$/, '')}/health`;
const TIMEOUT = parseInt(process.env.HEALTH_TIMEOUT || '30000', 10); // ms
const INTERVAL = 1000;

function openBrowser(url) {
  const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${start} "${url}"`, (err) => {
    if (err) console.error('Failed to open browser:', err);
  });
}

async function checkHealth() {
  const startTime = Date.now();

  function probe() {
    const req = http.get(HEALTH, (res) => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        console.log('[open-browser] Server healthy, opening:', URL);
        openBrowser(URL);
        res.resume();
        return;
      }
      res.resume();
      retry();
    });

    req.on('error', () => retry());
    req.setTimeout(2000, () => { req.destroy(); retry(); });

    function retry() {
      if (Date.now() - startTime > TIMEOUT) {
        console.error('[open-browser] Timeout waiting for /health');
        process.exit(1);
      } else {
        setTimeout(probe, INTERVAL);
      }
    }
  }

  probe();
}

checkHealth();

