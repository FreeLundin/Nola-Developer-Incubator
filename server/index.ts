import { createServer } from "http";
import { createApp } from "./app";
import { setupVite, log } from "./vite";
import fs from 'fs';
import path from 'path';

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
  const server = createServer(app);

  // determine NODE_ENV robustly and default to production when running from built dist
  // let NODE_ENV = (process.env.NODE_ENV || '').toString().trim();
  // try {
  //   // If NODE_ENV is not set and a built public folder exists next to this file, assume production
  //   const distPublic = path.resolve(__dirname, 'public');
  //   if (!NODE_ENV && fs.existsSync(distPublic)) {
  //     NODE_ENV = 'production';
  //   }
  // } catch (e) {
  //   // ignore filesystem checks in exotic environments
  // }
  // // If still unset and we're running the compiled bundle (argv includes dist/index.js), assume production
  // if (!NODE_ENV && isMain && process.argv.some((a) => String(a).endsWith('dist/index.js'))) {
  //   NODE_ENV = 'production';
  // }
  // console.log('server/index.ts starting with NODE_ENV=', NODE_ENV);
  // if (NODE_ENV !== "production") {
  //   await setupVite(app, server);
  // }

  // If NODE_ENV is not set, try to detect production by checking built dist/public or argv.
  if (process.env.NODE_ENV) {
    // Normalize any existing NODE_ENV (trim whitespace)
    process.env.NODE_ENV = process.env.NODE_ENV.toString().trim();
  }

  if (!process.env.NODE_ENV) {
    try {
      const distPublic = path.resolve(__dirname, 'public');
      if (fs.existsSync(distPublic)) {
        process.env.NODE_ENV = 'production';
      }
    } catch (e) {
      // ignore
    }

    // also treat running the compiled bundle as production
    if (!process.env.NODE_ENV && isMain && process.argv.some((a) => String(a).toLowerCase().endsWith('dist' + path.sep + 'index.js'))) {
      process.env.NODE_ENV = 'production';
    }
  }

  const NODE_ENV = (process.env.NODE_ENV || '').toString().trim();
  console.log('server/index.ts starting with NODE_ENV=', NODE_ENV);
  if (NODE_ENV !== 'production') {
    await setupVite(app, server);
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
