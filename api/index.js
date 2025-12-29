// Serverless function entry point
// This file exports the Express app as a serverless function handler

// Explicitly set runtime to Node.js since we use Node-specific APIs
// (fs, path, Buffer, process.env, etc.)
export const runtime = 'nodejs';

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

async function getApp() {
  if (!appPromise) {
    // Set production environment
    process.env.NODE_ENV = 'production';

    // Dynamic import of the built server bundle. Older builds placed createApp
    // in `dist/app.js` while current builds output a single `dist/index.js`.
    // Try both, but prefer index.js.
    let mod;
    try {
      mod = await import('../dist/index.js');
    } catch (eIndex) {
      try {
        mod = await import('../dist/app.js');
      } catch (eApp) {
        console.error('Failed to load server bundle:', eIndex, eApp);
        throw eIndex;
      }
    }

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

    if (typeof createApp !== 'function') {
      // If the import returned an object with multiple keys, try to find a function value
      const keys = Object.keys(mod || {});
      for (const k of keys) {
        if (typeof mod[k] === 'function') {
          createApp = mod[k];
          break;
        }
      }
    }

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

    appPromise = createApp();
  }
  return appPromise;
}

// Export handler for serverless functions
export default async function handler(req, res) {
  try {
    const app = await getApp();
    // Express apps can be called directly as functions
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error', message: String(error && error.message ? error.message : error) });
    }
  }
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
