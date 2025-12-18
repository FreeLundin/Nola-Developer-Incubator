import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    // @ts-ignore - preserve original res.json signature
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api") || path === "/health") {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch {
          // ignore stringify errors
        }
      }

      if (logLine.length > 200) {
        logLine = logLine.slice(0, 199) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Global error handler - return JSON but don't rethrow to avoid crashing the process
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    try {
      res.status(status).json({ message });
    } catch (e) {
      // If sending JSON fails, fallback to plain text
      try {
        res.status(status).type('text/plain').send(message);
      } catch {
        // nothing else we can do
      }
    }
    // do not throw after responding
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const port = Number(process.env.PORT || 5000);

  // use a portable listen signature to avoid ENOTSUP on some platforms
  const httpServer = server.listen(port, '0.0.0.0', () => {
    log(`serving on port ${port}`);
  });

  // Graceful shutdown handlers
  const shutdown = (signal?: string) => {
    log(`received ${signal ?? 'shutdown'} - closing server`);
    // stop accepting new connections
    httpServer.close((err) => {
      if (err) {
        log(`error during shutdown: ${String(err)}`);
        process.exit(1);
      }
      log('server closed gracefully');
      process.exit(0);
    });

    // force exit after timeout
    setTimeout(() => {
      log('forced shutdown after timeout');
      process.exit(1);
    }, 10000).unref();
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));

  // catch uncaught rejections and exceptions to allow for graceful logging
  process.on('unhandledRejection', (reason) => {
    log(`unhandledRejection: ${String(reason)}`);
  });
  process.on('uncaughtException', (err) => {
    log(`uncaughtException: ${String(err)}`);
  });

})();
