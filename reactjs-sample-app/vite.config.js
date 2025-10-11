import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Enable JSX runtime
      jsxRuntime: "automatic",
    }),
  ],
  server: {
    host: "0.0.0.0", // Allow external connections
    port: 80,
    allowedHosts: ["<hostname>", "localhost", "127.0.0.1"],
  },
  build: {
    // Optimize build output
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          vendor: ["react", "react-dom"],
          auth: ["oidc-client-ts"],
          egain: ["@egain/egain-api-typescript"],
          router: ["react-router-dom"],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "oidc-client-ts",
      "@egain/egain-api-typescript",
    ],
  },
});
