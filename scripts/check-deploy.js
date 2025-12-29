// Simple smoke tester for the built server bundle
// Usage: node scripts/check-deploy.js

import { spawn } from 'child_process';
import http from 'http';

const START_TIMEOUT = 15000; // ms
const HEALTH_TIMEOUT = 5000; // ms

async function waitForPortFromOutput(child) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Timed out waiting for server to announce port'));
    }, START_TIMEOUT);

    function onData(chunk) {
      const text = String(chunk);
      // Look for patterns like "serving on port 5000" or "serving on port 1234"
      const m = text.match(/serving on port\s*(\d+)/i);
      if (m) {
        clearTimeout(timer);
        child.stdout.removeListener('data', onData);
        resolve(Number(m[1]));
      }
    }

    child.stdout.on('data', onData);
    child.stderr.on('data', (c) => {
      // keep stderr readable for debugging
      // but also look for the same log pattern
      onData(c);
    });

    child.on('exit', (code, signal) => {
      clearTimeout(timer);
      reject(new Error(`Server process exited prematurely with code=${code} signal=${signal}`));
    });
  });
}

async function httpGetJson(hostname, port, path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname, port, path, timeout: HEALTH_TIMEOUT }, (r) => {
      let data = '';
      r.on('data', (chunk) => (data += chunk));
      r.on('end', () => {
        resolve({ statusCode: r.statusCode, body: data });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function main() {
  // Spawn the built server bundle. Ensure we run from repo root.
  const child = spawn(process.execPath, ['dist/index.js'], {
    env: { ...process.env, NODE_ENV: 'production' },
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  // Pipe server output to our console for visibility
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  try {
    const port = await waitForPortFromOutput(child);
    console.log('Detected server port:', port);

    const res = await httpGetJson('127.0.0.1', port, '/health');
    console.log('Health check response:', res);
  } catch (err) {
    console.error('Smoke test failed:', err);
    child.kill('SIGTERM');
    process.exit(1);
  }

  // Shutdown child
  child.kill('SIGTERM');
  // wait a short moment for graceful shutdown
  await new Promise((r) => setTimeout(r, 500));
  process.exit(0);
}

main();
