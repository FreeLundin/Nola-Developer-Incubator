// Vercel Serverless Function Entry Point
// This file wraps the Express app for Vercel's serverless environment

// Explicitly set runtime to Node.js since we use Node-specific APIs
// (fs, path, Buffer, process.env, etc.)
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
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      query: req.query,
    };
    console.log('[API Request]', JSON.stringify(logEntry));
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
      env: process.env.NODE_ENV || 'development',
      runtime: 'nodejs'
    });
  } catch (error) {
    console.error('[API Error]', {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Serve static files in production
const distPath = resolve(__dirname, '..', 'dist', 'public');

if (fs.existsSync(distPath)) {
  // Serve static assets
  app.use(express.static(distPath));
  
  // Fallback to index.html for client-side routing (SPA)
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(resolve(distPath, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.status(503).json({ 
      error: 'Application not built',
      message: 'Please run npm run build before deploying' 
    });
  });
}

// Enhanced error handler with structured logging
app.use((err, req, res, next) => {
  // Structured error logging
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: err.message || 'Internal Server Error',
    stack: err.stack || 'No stack trace',
    status: err.status || err.statusCode || 500
  };
  console.error('[API Error]', JSON.stringify(errorLog, null, 2));
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Don't send response if headers already sent
  if (!res.headersSent) {
    res.status(status).json({ 
      error: message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

// Export the Express app for Vercel
export default app;
