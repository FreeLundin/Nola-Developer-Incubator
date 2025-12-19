// Vercel serverless function entry point
// This file exports the Express app as a serverless function handler

// Cache the app instance to avoid recreating it on every request
let appPromise = null;

async function getApp() {
  if (!appPromise) {
    // Set production environment
    process.env.NODE_ENV = 'production';
    
    // Dynamic import of the app module
    const { createApp } = await import('../dist/app.js');
    appPromise = createApp();
  }
  return appPromise;
}

// Export handler for Vercel serverless functions
export default async function handler(req, res) {
  try {
    const app = await getApp();
    // Express apps can be called directly as functions
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
