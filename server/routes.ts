import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // health check
  app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

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
    try {
      const file = path.resolve(process.cwd(), 'bots.override.json');
      fs.writeFileSync(file, JSON.stringify(req.body, null, 2), 'utf-8');
      return res.status(200).json({ status: 'saved' });
    } catch (e) {
      return res.status(500).json({ error: 'failed to save' });
    }
  });

  return createServer(app);
}
