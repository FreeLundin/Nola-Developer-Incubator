import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { type Server } from "http";
import { fileURLToPath } from 'url';

// ESM-safe main module check
const __filename = fileURLToPath(import.meta.url);
const isMain = typeof process !== 'undefined' && process.argv[1] === __filename;

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

// Start server helper that returns the http.Server and a shutdown function so tests/pm2 can use it
export async function startServer(): Promise<{ server: Server; shutdown: (code?: number) => Promise<void> }> {
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
    await setupVite(app, server as Server);
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

  // Track open sockets so we can destroy them on shutdown (avoid hanging connections)
  const sockets = new Set<any>();
  httpServer.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });

  let shuttingDown = false;

  const shutdown = async (code = 0) => {
    if (shuttingDown) return;
    shuttingDown = true;
    log(`shutdown initiated (code=${code}) - stop accepting new connections`);

    // stop accepting new connections
    await new Promise<void>((resolve) => {
      httpServer.close((err) => {
        if (err) {
          log(`error closing server: ${String(err)}`);
        }
        resolve();
      });

      // Also destroy lingering sockets after short grace period
      setTimeout(() => {
        log(`destroying ${sockets.size} lingering sockets`);
        sockets.forEach((s) => { try { (s as any).destroy(); } catch { /* ignore */ } });
      }, 2000).unref();
    });

    log('server closed gracefully');
    // allow caller to decide exit
  };

  // listen to signals for graceful shutdown only when run directly (not when used in tests)
  if (isMain) {
    process.once('SIGINT', () => {
      shutdown(0).then(() => process.exit(0));
    });
    process.once('SIGTERM', () => {
      shutdown(0).then(() => process.exit(0));
    });

    // catch uncaught rejections and exceptions to allow for graceful logging
    process.on('unhandledRejection', (reason) => {
      log(`unhandledRejection: ${String(reason)}`);
    });
    process.on('uncaughtException', (err) => {
      log(`uncaughtException: ${String(err)}`);
    });
  }

  return { server: httpServer, shutdown };
}

// If this file is run directly, start the server and attach a shutdown that exits the process
if (isMain) {
  (async () => {
    const { shutdown } = await startServer();
    // Do not call shutdown() immediately — keep the server running and rely on signal handlers
    // that were registered inside startServer() when running as main.

    // Keep process alive. If a forced shutdown is needed, it will be handled by the installed signal handlers.
    // If you want an explicit programmatic shutdown from this block, call shutdown() on signal handlers only.
  })();
}
