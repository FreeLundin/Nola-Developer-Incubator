// Vercel Serverless Function Entry Point
// This file wraps the Express app for Vercel's serverless environment

// Explicitly set Node.js runtime for Vercel
// This is required for Node-specific APIs like fs, crypto, process, etc.
export const config = {
  runtime: 'nodejs'
};

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app with enhanced error handling
const app = express();

// Body parser middleware with error handling
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    // Store raw body for webhook signature verification if needed
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}));
app.use(express.urlencoded({ extended: false }));

// Enhanced logging middleware for API routes with structured data
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown'
    };
    console.log('[API Request]', JSON.stringify(logData));
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
    // Validate critical environment variables (if any are required)
    // For health check, we just report status
    const requiredEnvVars = process.env.DATABASE_URL ? ['DATABASE_URL'] : [];
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL
    });
  } catch (error) {
    console.error('[Health Check Error]', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Health check failed'
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

// Global error handler with structured logging
app.use((err, req, res, next) => {
  // Structured error logging
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    statusCode: err.status || err.statusCode || 500
  };
  
  console.error('[Unhandled Error]', JSON.stringify(errorLog));
  
  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message || 'Internal Server Error';
  
  // Ensure we don't send response if headers already sent
  if (!res.headersSent) {
    res.status(status).json({ 
      error: message,
      timestamp: new Date().toISOString()
    });
  }
});

// Export the Express app for Vercel
export default app;
