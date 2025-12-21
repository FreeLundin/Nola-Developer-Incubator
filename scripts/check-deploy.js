// Simple smoke tester for the built server bundle
// Usage: node scripts/check-deploy.js

import http from 'http';

async function main() {
  try {
    const mod = await import('../dist/index.js');
    // Try to locate createApp or an Express app
    const createApp = mod.createApp || (mod.default && mod.default.createApp) || mod.default || mod;
    if (typeof createApp !== 'function') {
      console.error('Could not find createApp in dist/index.js');
      process.exit(2);
    }

    const app = await createApp();

    // start server on ephemeral port
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    console.log('Local test server listening on port', port);

    // perform a simple http request to /health
    const res = await new Promise((resolve, reject) => {
      const req = http.get({ hostname: '127.0.0.1', port, path: '/health', timeout: 5000 }, (r) => {
        let data = '';
        r.on('data', (chunk) => (data += chunk));
        r.on('end', () => resolve({ statusCode: r.statusCode, body: data }));
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    });

    console.log('Health check response:', res);
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(1);
  }
}

main();

