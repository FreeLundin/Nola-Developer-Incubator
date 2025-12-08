import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import glsl from "vite-plugin-glsl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
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
  },
  server: {
    // Note: In development, Vite runs in middleware mode via Express on port 5000
    // This port (5173) is used internally by Vite but not directly accessible
    port: 5173,
    strictPort: false,
    host: true,
    open: false,
  },
  // Add support for large models and audio files
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
  // Optimize dependencies for faster dev server startup
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "zustand",
    ],
  },
});
