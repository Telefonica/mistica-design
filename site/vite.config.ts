import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(), // provides Buffer and other Node globals used by existing helpers
    {
      // In production the api/ routes are Vercel serverless functions.
      // In local dev, Vite would serve the raw JS source instead of a 404,
      // causing JSON.parse errors in the callers. Return 404 to match the
      // production-absent behaviour and keep error handling consistent.
      name: 'block-api-routes',
      configureServer(server) {
        server.middlewares.use('/api', (_req, res) => {
          res.statusCode = 404;
          res.end();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tokens': resolve(__dirname, '../tokens'),
    },
  },
});
