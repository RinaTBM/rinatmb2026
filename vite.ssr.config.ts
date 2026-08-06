import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    ssr: 'scripts/prerender.tsx',
    outDir: 'dist/prerender',
    emptyOutDir: false,
    rollupOptions: {
      external: ['react-dom/server', 'react', 'react/jsx-runtime'],
    },
  },
});
