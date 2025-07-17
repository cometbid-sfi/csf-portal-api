// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Explicitly configure asset handling
  publicDir: 'public',
  
  // Configure the base URL if needed
  base: '/',
  
  // Configure the build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  },
  
  // Configure the server
  server: {
    port: 5173,
    open: true
  }
});
