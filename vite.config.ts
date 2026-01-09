import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import glsl from "vite-plugin-glsl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Compute a sensible base path when running in GitHub Actions so Vite emits
// assets with the repository name as the base (e.g. '/repo-name/'). Locally
// and in other CI this will default to '/'.
const repoBase =
  process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY.includes('/')
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/';



const defaultBase = process.env.GH_PAGES_BASE || (repoBase === '/' ? './' : repoBase);

export default defineConfig({
  // Use the computed base by default. If you need a custom base for other
  // hosting (CDN or custom domain), set the GH_PAGES_BASE env var or override
  // this value in your environment.
  base: defaultBase,
  plugins: [
    react(),
    glsl(), // Add GLSL shader support
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    // Optimize for modern browsers
    target: "esnext",
    minify: "terser",
    sourcemap: true,
    // Increase chunk warning threshold for large asset-heavy scenes,
    // and avoid inlining large assets which bloats JS bundles.
    chunkSizeWarningLimit: 1400,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Keep vendor splitting but make chunking a bit more explicit so
        // large 3D libraries can be cached separately.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('@react-three') || id.includes('@react-three/fiber')) return 'vendor-r3f';
            if (id.includes('@react-three/drei')) return 'vendor-drei';
            if (id.includes('postprocessing') || id.includes('@react-three/postprocessing')) return 'vendor-postprocessing';
            return 'vendor';
          }
        }
      }
    },
  },
  server: {
    // Note: In development, Vite runs in middleware mode via Express on port 5000
    // This port (5173) is used internally by Vite but not directly accessible
    // by external browsers when proxied through the server dev middleware.
    port: 5173,
    strictPort: false,
    host: true,
    open: false,
  },
  // Add support for large models and audio files
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
  // Optimize dependencies for faster dev server startup. Include heavy 3D libs
  // so they are pre-bundled for improved cold-start performance.
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "@react-three/postprocessing",
      "postprocessing",
      "r3f-perf",
      "zustand",
      "react-confetti",
    ],
    // Keep the prebundle list focused; if you see odd module resolution
    // issues in dev, try excluding specific packages here.
    exclude: [],
  },
});
