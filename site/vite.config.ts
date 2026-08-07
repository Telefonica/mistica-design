import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(), // provides Buffer and other Node globals used by existing helpers
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tokens': resolve(__dirname, '../tokens'),
    },
  },
});
