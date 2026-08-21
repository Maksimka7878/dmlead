import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  ssr: {
    // react-helmet-async публикуется как CommonJS — при внешнем резолве
    // Node не видит именованных экспортов, поэтому вшиваем его в SSR-бандл.
    noExternal: ['react-helmet-async'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: isSsrBuild
    ? {
        // Сборка для пререндера: только рендер в строку, ассеты не нужны.
        ssr: 'entry-server.tsx',
        outDir: 'dist-ssr',
        emptyOutDir: true,
      }
    : {
        outDir: 'dist',
        // CSS выносится в отдельный файл, а не инлайнится в JS: страницы
        // отдаются пререндером, и стиль должен приходить с HTML, а не после
        // выполнения бандла.
        cssCodeSplit: false,
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
              'vendor-ui': ['lucide-react'],
            },
          },
        },
      },
}));
