import {createServer} from "http";
import {createApp} from "./app";
import {log, setupVite} from "./vite";
import type {NextFunction, Request, Response} from 'express';
import type {Socket} from 'net';

console.log('server/index.ts executing', { argv: process.argv.slice(0, 10), nodeEnv: process.env.NODE_ENV });

// Check if this module is being run directly
// Some loaders (like tsx) set process.argv differently, so make this detection
// robust: treat the module as main if either import.meta.url matches argv[1]
// or if argv contains the server entry path. Accept both source and built entry names
// so `node dist/index.js`, `tsx server/index.ts` and similar invocations start the server.
const entryCandidates = ["server/index.ts", "dist/index.js", "index.js", "server/index.js"];
const isMain =
  import.meta.url === `file://${process.argv[1]}` ||
  (process.argv && process.argv.some((a) => entryCandidates.some((c) => String(a).endsWith(c))));

async function startServer() {
  const app = await createApp();

  // create a server instance (used by Vite in dev mode for HMR)
  let server = createServer(app);

  // determine NODE_ENV robustly and default to production when running from built dist
  // (accidental shell command removed here)

  // If NODE_ENV is set, normalize it by trimming whitespace
  if (process.env.NODE_ENV) {
    process.env.NODE_ENV = process.env.NODE_ENV.toString().trim();
  }

  app.use(((err: any, req: Request, res: Response, _next: NextFunction) => {
    // Structured error logging
    const errorLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: (req as any).path,
      error: err?.message || 'Internal Server Error',
      stack: err?.stack || 'No stack trace',
      status: (err && (err.status || err.statusCode)) || 500
    };
    console.error('[API Error]', JSON.stringify(errorLog, null, 2));

    const status = (err && (err.status || err.statusCode)) || 500;
    const message = err?.message || 'Internal Server Error';

    // Don't send response if headers already sent
    if (!('headersSent' in res) || !(res as any).headersSent) {
      (res as Response).status(status as number).json({ 
        error: message,
        // Only include details in development
        ...(process.env.NODE_ENV === "development" && { stack: err?.stack })
      });
    }
  }) as unknown as any);

  const NODE_ENV = (process.env.NODE_ENV || '').toString().trim();
  console.log('server/index.ts starting with NODE_ENV=', NODE_ENV);
  if (NODE_ENV !== 'production') {
    await setupVite(app, server);
  }

  // ALWAYS serve the app on port 5000 by default
  const desiredPort = Number(process.env.PORT || 5000);

  // Attempt to listen on the desired port; if it's in use, fall back to an ephemeral port (0)
  // Keep the same `server` instance so Vite HMR (dev) continues to work with it.
  const httpServer = await new Promise<any>((resolve, reject) => {
    // Helper to resolve once server is listening
    const onListening = () => {
      // remove temporary error listener
      server.removeAllListeners('error');
      resolve(server);
    };

    // Error handler to detect EADDRINUSE and fall back
    const onError = (err: any) => {
      if (err && err.code === 'EADDRINUSE') {
        log(`port ${desiredPort} in use, falling back to ephemeral port`);
        // Try to listen on an ephemeral port (0)
        // remove this error handler to avoid double-handling
        server.removeListener('error', onError);
        try {
          server.listen(0, onListening);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(err);
      }
    };

    server.once('error', onError);

    try {
      server.listen(desiredPort, onListening);
    } catch (e) {
      // synchronous exception (rare) — try ephemeral port
      server.removeListener('error', onError);
      try {
        server.listen(0, onListening);
      } catch (err) {
        reject(err);
      }
    }
  });

  // At this point server is listening — determine actual port
  const actualAddress = httpServer.address();
  const actualPort = typeof actualAddress === 'object' && actualAddress ? (actualAddress as any).port : desiredPort;
  process.env.PORT = String(actualPort);
  log(`serving on port ${actualPort}`);

  // Track open sockets so we can destroy them on shutdown (avoid hanging connections)
  const sockets = new Set<any>();
  httpServer.on('connection', (socket: Socket) => {
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
      httpServer.close((err?: Error | null) => {
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
    await startServer();
    // Do not call shutdown() immediately — keep the server running and rely on signal handlers only.
  })();
}
