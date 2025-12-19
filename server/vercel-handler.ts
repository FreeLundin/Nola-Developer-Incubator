// Lazy-initializing Vercel serverless handler to avoid throwing during module import-time.
// This prevents cold-start failures when environment variables or dev-only packages
// are not available at import time.

import type { IncomingMessage, ServerResponse } from 'http';

let _handler: any = null;
let _initError: any = null;

async function initHandler() {
  if (_handler) return _handler;
  if (_initError) throw _initError;

  try {
    // Dynamically import the app factory and serverless wrapper so the module
    // evaluation doesn't fail during cold start if devDependencies or envs are missing.
    const appModule = await import('./express-app');
    const createApp = (appModule && (appModule.default || appModule.createApp)) || appModule;
    if (typeof createApp !== 'function') {
      throw new Error('createApp is not a function');
    }

    const app = createApp();

    // Try to import serverless-http; if unavailable, fall back to the raw Express app
    try {
      const serverlessModule = await import('serverless-http');
      const serverlessFn = serverlessModule && (serverlessModule.default || serverlessModule);
      if (typeof serverlessFn === 'function') {
        _handler = serverlessFn(app);
        return _handler;
      }
      // If serverless-http didn't export a function, fall through to fallback
      console.error('[vercel-handler] serverless-http did not export a function; falling back to raw app');
    } catch (innerErr) {
      // Common in serverless environments where devDependencies are not installed
      const _inner: any = innerErr;
      console.warn('[vercel-handler] failed to import serverless-http; using raw express app as handler', _inner?.message || _inner);
      // fall through to set the raw app as handler
    }

    // Fallback: use the express app itself as the handler. Vercel will forward the
    // native Node req/res objects which Express can handle directly.
    _handler = (req: IncomingMessage & any, res: ServerResponse & any) => {
      try {
        // Express apps are functions that accept (req, res)
        return (app as any)(req, res);
      } catch (e) {
        const _e: any = e;
        console.error('[vercel-handler] fallback handler error', _e?.stack || _e?.message || _e);
        throw e;
      }
    };

    return _handler;
  } catch (err) {
    // Cache init error to avoid repeated re-init attempts on subsequent invocations
    const _err: any = err;
    _initError = _err instanceof Error ? _err : new Error(String(_err));
    console.error('[vercel-handler] initialization error:', _err && (_err.stack || _err.message || _err));
    throw _initError;
  }
}

/**
 * Vercel-compatible default export handler. This function lazily initializes the
 * Express app on first invocation and then delegates to the `serverless-http` handler
 * (or the raw Express app as a fallback).
 */
export default async function vercelHandler(req: IncomingMessage & any, res: ServerResponse & any) {
  try {
    const handler = await initHandler();
    // handler expects (req, res) like a standard Node http request
    return handler(req, res);
  } catch (err) {
    const _err: any = err;
    console.error('[vercel-handler] invocation error:', _err && (_err.stack || _err.message || _err));
    try {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Server initialization failed' }));
    } catch (e) {
      // If even responding fails, just log and swallow to avoid crashing the runtime
      const _e: any = e;
      console.error('[vercel-handler] failed to send error response:', _e && (_e.stack || _e.message || _e));
    }
  }
}

// Provide CommonJS compatibility so both ESM and CJS consumers on Vercel can use the handler
// (Vercel may invoke the function via module.exports under some runtimes).
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: module.exports assignment for compatibility
module.exports = vercelHandler;
