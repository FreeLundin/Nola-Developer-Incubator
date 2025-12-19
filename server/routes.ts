import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { asyncHandler, allowMethods } from "./errorHandler";
import { requireEnv } from "./requireEnv";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Example API route with error handling and env validation
  // This demonstrates best practices for Vercel serverless functions
  app.get('/api/status', asyncHandler(async (req, res) => {
    // Example: Validate environment variables if this route needs them
    // Uncomment when DATABASE_URL is required for this endpoint:
    // requireEnv(['DATABASE_URL']);
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Server is running with enhanced error handling'
    });
  }));

  const httpServer = createServer(app);

  return httpServer;
}
