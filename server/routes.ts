import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { asyncHandler } from "./http";
// import { requireEnv } from "./requireEnv";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Example route with error handling:
  // app.get('/api/users/:id', asyncHandler(async (req, res) => {
  //   // Validate environment variables if needed
  //   // requireEnv(['DATABASE_URL']);
  //   
  //   const userId = parseInt(req.params.id);
  //   const user = await storage.getUser(userId);
  //   
  //   if (!user) {
  //     return res.status(404).json({ error: 'User not found' });
  //   }
  //   
  //   res.json(user);
  // }));

  const httpServer = createServer(app);

  return httpServer;
}
