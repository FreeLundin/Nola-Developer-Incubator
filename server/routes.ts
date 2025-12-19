import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { asyncHandler, methodGuard } from "./http";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Health check endpoint with error handling
  app.get('/api/health', asyncHandler(async (req, res) => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: nodeEnv,
      runtime: 'nodejs',
    });
  }));



  // Example of a protected route that requires environment variables
  // Uncomment and modify as needed:
  /*
  import { requireEnv } from './requireEnv';
  
  app.post('/api/data', methodGuard(['POST']), asyncHandler(async (req, res) => {
    // Validate required environment variables at the start of the handler
    // This will throw an error with a clear message if any are missing
    requireEnv(['DATABASE_URL', 'API_KEY']);
    
    // Your route logic here - env vars are now guaranteed to exist
    const dbUrl = process.env.DATABASE_URL;
    const apiKey = process.env.API_KEY;
    
    res.json({ success: true });
  }));
  */

  const httpServer = createServer(app);

  return httpServer;
}
