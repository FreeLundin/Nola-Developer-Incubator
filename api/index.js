// Serverless function entry point
// This file exports the Express app as a serverless function handler

// Cache the app instance to avoid recreating it on every request
let appPromise = null;

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

    // The bundled module might export the createApp function in different shapes:
    // - export async function createApp() {}
    // - export default { createApp }
    // - export default createApp
    // - module.exports = createApp (CommonJS transformed)
    let createApp = mod.createApp || (mod.default && mod.default.createApp) || mod.default || mod;

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

    if (typeof createApp !== 'function') {
      throw new Error('Could not find createApp() function in built server bundle');
    }

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
