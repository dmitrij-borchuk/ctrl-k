/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';

import { transformSync } from 'esbuild';

/**
 * Minifies the inlined CSS template literal in styles.ts and emits a standalone CSS asset.
 */
function minifyCssPlugin(): Plugin {
  let minifiedCss = '';

  return {
    name: 'minify-css-plugin',
    transform(code: string, id: string) {
      if (id.endsWith('styles.ts') || id.endsWith('styles.js')) {
        const transformedCode = code.replace(
          /export const DEFAULT_STYLES = `([\s\S]*?)`;/,
          (_, rawCss) => {
            const minified = transformSync(rawCss, {
              loader: 'css',
              minify: true,
            }).code.trim();
            minifiedCss = minified;
            return `export const DEFAULT_STYLES = ${JSON.stringify(minified)};`;
          }
        );
        return {
          code: transformedCode,
          map: { mappings: '' } as const,
        };
      }
    },
    generateBundle() {
      if (minifiedCss) {
        this.emitFile({
          type: 'asset',
          fileName: 'vanilla-k.css',
          source: minifiedCss,
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [
    minifyCssPlugin(),
    dts({
      include: ['src'],
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VanillaK',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.mjs';
        if (format === 'cjs') return 'index.cjs';
        return 'vanilla-k.min.js';
      },
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
