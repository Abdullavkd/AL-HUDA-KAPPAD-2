import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/\/(react-router|react-router-dom)\//.test(id)) return 'vendor-router';
          if (/\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react';
          if (/\/(lucide-react|react-icons)\//.test(id)) return 'vendor-icons';
        }
      }
    }
  }
});
