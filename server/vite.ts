import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import { nanoid } from "nanoid";

// Lightweight logger that doesn't depend on Vite. This avoids pulling Vite into
// the serverless runtime where devDependencies may be pruned.
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Dynamically import Vite here so the module isn't required at import-time.
  // This keeps the serverless bundle small and avoids runtime failures when
  // Vite is not available in production environments.
  const { createServer: createViteServer, createLogger } = await import("vite");

  // Dynamically load the vite config only when we actually need it (development)
  const viteConfigModule = await import("../vite.config");
  const viteConfig = (viteConfigModule && (viteConfigModule.default || viteConfigModule)) as any;

  const viteLogger = createLogger();

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  } as any;

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg: any, options: any) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(__dirname, "..", "client", "index.html");

      // always reload the index.html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
