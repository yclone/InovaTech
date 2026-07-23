import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Base URL - ajuste se deployar em subpasta
  base: './',

  server: {
    port: 5173,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    target: 'es2015',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa vendor code para melhor cache
          vendor: ['vite'],
        },
        // Nomes dos arquivos com hash para cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    // Configurações de otimização
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  preview: {
    port: 4173,
    host: true,
    open: true,
  },

  // Otimizações de desenvolvimento
  optimizeDeps: {
    include: [],
  },
});
