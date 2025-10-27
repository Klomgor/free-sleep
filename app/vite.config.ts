import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import info from '../server/src/serverInfo.json';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), sentryVitePlugin({
    org: 'free-sleep',
    project: 'app',
    release: {
      name: info.version,
    }
  })],
  server: {
    host: '0.0.0.0', // This makes the server accessible to other devices on the network
    port: 5173, // Optional: specify a port if you want something other than the default
  },
  build: {
    sourcemap: true,
    outDir: '../server/public/',
    rollupOptions: {
      output: {
        entryFileNames: 'index.js', // Set the name for the JS entry file
        chunkFileNames: '[name]-[hash].js', // Names for dynamic imports
        assetFileNames: ({ name }) => {
          if (name?.endsWith('.css')) {
            return 'index.css';
          }
          return '[name]-[hash].[ext]';
        },
      },
    },
  },
});
