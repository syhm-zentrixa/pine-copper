import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  cacheDir: process.env.DEV_CACHE_DIR || 'node_modules/.vite',
  plugins: [react()],
  server: {
    host: process.env.DEV_HOST || '0.0.0.0',
    port: Number(process.env.DEV_PORT || 5174),
    strictPort: true,
    proxy: {
      '/api': { target: `http://127.0.0.1:${process.env.API_PORT || 8788}`, changeOrigin: false },
    },
    fs: {
      deny: [
        '.env',
        '.env.*',
        '*.{crt,pem}',
        '**/.git/**',
        '**/.data/**',
        '**/server/**',
        '**/tests/**',
      ],
    },
  },
  build: { target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 500 },
});
