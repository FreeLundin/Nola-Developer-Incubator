// Vercel Serverless Function Entry Point
// This file wraps the Express app for Vercel's serverless environment
// 
// Runtime Configuration:
// This function uses Node.js runtime because it:
// - Uses Node.js built-in modules (fs, path, url)
// - Serves static files from the filesystem
// - Provides Express.js middleware functionality
//
// For Vercel deployment, this is automatically detected as a Node.js function
// via the @vercel/node builder in vercel.json

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Parse JSON bodies with size limit
// Express will handle JSON parsing errors automatically
app.use(express.json({
  limit: '10mb'
}));

app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Structured logging middleware for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
      timestamp,
      method: req.method,
      path: req.path,
      query: req.query,
    }));
  }
  next();
});

// Register API routes with error handling
// All routes are wrapped with try-catch to prevent unhandled errors

// Health check endpoint - wrapped with error handling
app.get('/api/health', async (req, res, next) => {
  try {
    // Verify NODE_ENV is set (optional but recommended)
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      env: nodeEnv,
      runtime: 'nodejs',
    });
  } catch (error) {
    next(error);
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

// Comprehensive error handler - must be last middleware
// This catches all unhandled errors and returns proper JSON responses
app.use((err, req, res, next) => {
  // Structured error logging
  const timestamp = new Date().toISOString();
  console.error(JSON.stringify({
    timestamp,
    method: req.method,
    path: req.path,
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
      status: err.status || err.statusCode || 500,
    },
  }, null, 2));

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Always return JSON for API routes
  if (!res.headersSent) {
    res.status(status).json({ 
      error: message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
      }),
    });
  }
});

// Export the Express app for Vercel
export default app;
