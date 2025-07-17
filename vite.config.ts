// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import type { Plugin } from "vite";

// Create a plugin to handle YAML files
const yamlPlugin: Plugin = {
  name: "yaml-handler",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.endsWith(".yaml")) {
        res.setHeader("Content-Type", "application/x-yaml");
        const filePath = resolve(__dirname, req.url.slice(1));
        if (fs.existsSync(filePath)) {
          res.end(fs.readFileSync(filePath, "utf8"));
          return;
        }
      }
      next();
    });
  },
};

// Determine if we're in production mode
const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  // Explicitly configure asset handling
  publicDir: "public",

  // Configure the base URL - empty for local dev, path for production
  base: isProd ? "/csf-portal-api/" : "",

  // Add the YAML plugin
  plugins: [yamlPlugin],

  // Configure the build
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },

  // Configure the server
  server: {
    port: 5173,
    open: true,
  },
});
