import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { asyncHandler } from "./http";
import fs from 'fs';
import path from 'path';
import sessionRoutes from './routes/sessionRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';

export function attachRoutes(app: Express) {
  // health check
  app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

  // Session save/load API (stubs)
  app.use(sessionRoutes);
  // Leaderboard API
  app.use(leaderboardRoutes);
  
  // serve runtime bot override if present at project root (bots.override.json)
  app.get('/bots.override.json', (_req, res) => {
    const file = path.resolve(process.cwd(), 'bots.override.json');
    if (!fs.existsSync(file)) return res.status(404).json({ error: 'no override' });
    try {
      const content = fs.readFileSync(file, 'utf-8');
      return res.status(200).type('application/json').send(content);
    } catch (e) {
      return res.status(500).json({ error: 'failed to read override' });
    }
  });

  // simple admin-only route to save overrides (local development only)
  app.post('/admin/bots', (req, res) => {
    // Prevent writes in production or serverless environments
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'writing overrides is disabled in production' });
    }

    try {
      const payload = req.body || {};
      const file = path.resolve(process.cwd(), 'bots.override.json');
      fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf-8');
      return res.json({ ok: true });
    } catch (e) {
      console.error('failed to write bot override', e);
      return res.status(500).json({ error: 'failed to save override' });
    }
  });

  // Client-side logging endpoint for asset/load issues
  app.post('/api/logs', (req, res) => {
    try {
      const payload = req.body || {};
      const logDir = path.resolve(process.cwd(), 'logs');
      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
      const file = path.join(logDir, 'client-asset-issues.log');
      const entry = JSON.stringify({ ts: new Date().toISOString(), ip: req.ip, ua: req.get('user-agent'), payload }) + '\n';
      fs.appendFileSync(file, entry, 'utf-8');
      return res.json({ ok: true });
    } catch (e) {
      console.error('failed to write client log', e);
      return res.status(500).json({ error: 'failed to write log' });
    }
  });

  // Example route with error handling (kept as comment for reference):
  // app.get('/api/users/:id', asyncHandler(async (req, res) => { ... }));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // attach routes to the provided app then return an http.Server
  attachRoutes(app);
  return createServer(app);
}
