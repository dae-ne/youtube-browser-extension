import { defineConfig } from 'vite';

export default defineConfig({
  root: './src/options-ui/',
  base: './',
  build: {
    outDir: '../../dist/options-ui/',
    emptyOutDir: true,
    minify: true
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' }
    }
  }
});
