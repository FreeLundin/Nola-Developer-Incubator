import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
