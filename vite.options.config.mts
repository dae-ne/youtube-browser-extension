import { defineConfig } from 'vite';

export default defineConfig({
  root: './src/options/',
  base: './',
  build: {
    outDir: '../../dist/options/',
    emptyOutDir: true,
    minify: true
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' }
    }
  }
});
