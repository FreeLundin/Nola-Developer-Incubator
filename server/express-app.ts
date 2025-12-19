import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { attachRoutes } from './routes';
import { log } from './vite';

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Request/response logging middleware (kept from existing server/index.ts)
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    // @ts-ignore preserve original signature
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson as Record<string, any>;
      // @ts-ignore
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on('finish', () => {
      const duration = Date.now() - start;
      if (path.startsWith('/api') || path === '/health') {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          try {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          } catch {
            // ignore stringify errors
          }
        }

        if (logLine.length > 200) {
          logLine = logLine.slice(0, 199) + '…';
        }

        log(logLine);
      }
    });

    next();
  });

  // Attach application routes
  attachRoutes(app);

  // Global error handler - return JSON but don't rethrow to avoid crashing the process
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    try {
      res.status(status).json({ message });
    } catch (e) {
      try {
        res.status(status).type('text/plain').send(message);
      } catch {
        // nothing else we can do
      }
    }
    // do not throw after responding
  });

  return app;
}

export default createApp;

