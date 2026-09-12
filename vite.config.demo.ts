import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: resolve(__dirname, 'demo'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist-demo'),
    emptyOutDir: true,
  },
});
