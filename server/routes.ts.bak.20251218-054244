import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from 'fs';
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Lightweight health/readiness endpoint for CI and probes
  app.get('/health', (_req, res) => {
    // Add CORS headers to make the endpoint fetchable from the docs site during local testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      time: new Date().toISOString(),
    });
  });

  // Example API route (kept minimal) - storage can be used for real endpoints
  app.get('/api/ping', (_req, res) => res.json({ pong: true }));

  // Return the last generated public URL (written by scripts/start-cloud-tunnel.ps1)
  app.get('/api/last-public-url', async (_req, res) => {
    try {
      const repoRoot = path.resolve(__dirname, '..');
      const filePath = path.join(repoRoot, 'docs', 'last-public-url.txt');
      if (!fs.existsSync(filePath)) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.json({ url: null });
      }

      const txt = await fs.promises.readFile(filePath, 'utf8');
      const url = (txt || '').trim() || null;
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.json({ url });
    } catch (err) {
      console.error('Failed to read last-public-url', err);
      res.status(500).json({ error: 'Failed to read last-public-url' });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return createServer(app);
}
