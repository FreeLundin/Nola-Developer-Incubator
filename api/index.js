// Vercel Serverless Function Entry Point
// This file wraps the Express app for Vercel's serverless environment

// Explicitly set runtime to Node.js since we use Node-specific APIs
// (fs, path, url, process, express, Buffer)
export const runtime = 'nodejs';

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Structured logging middleware for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      type: 'request'
    }));
  }
  next();
});

// Register API routes
// Add your API routes here with /api prefix
// Example:
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

// Health check endpoint with error handling
app.get('/api/health', (req, res) => {
  try {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV 
    });
  } catch (error) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: 'error'
    }));
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal Server Error',
        timestamp: new Date().toISOString()
      });
    }
  }
});

// Serve static files in production with error handling
const distPath = resolve(__dirname, '..', 'dist', 'public');

if (fs.existsSync(distPath)) {
  // Serve static assets
  app.use(express.static(distPath));
  
  // Fallback to index.html for client-side routing (SPA)
  app.get('*', (req, res) => {
    try {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ 
          error: 'API endpoint not found',
          path: req.path,
          timestamp: new Date().toISOString()
        });
      }
      res.sendFile(resolve(distPath, 'index.html'));
    } catch (error) {
      console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: 'error'
      }));
      
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Internal Server Error',
          timestamp: new Date().toISOString()
        });
      }
    }
  });
} else {
  app.get('*', (req, res) => {
    try {
      res.status(503).json({ 
        error: 'Application not built',
        message: 'Please run npm run build before deploying',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'error'
      }));
    }
  });
}

// Global error handler with structured logging
app.use((err, req, res, next) => {
  // Log error with structured information
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: err.message || 'Unknown error',
    stack: err.stack,
    type: 'error'
  }));
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  if (!res.headersSent) {
    res.status(status).json({ 
      error: message,
      timestamp: new Date().toISOString(),
      path: req.path
    });
  }
});

// Export the Express app for Vercel
export default app;
