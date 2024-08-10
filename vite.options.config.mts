import { defineConfig } from 'vite';

export default defineConfig({
    root: './extension/options/',
    base: './',
    build: {
        outDir: '../../dist/options/',
        emptyOutDir: true,
        minify: true
    }
});
