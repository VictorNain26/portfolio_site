import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  test: {
    // Environment
    environment: 'jsdom',

    // Setup files
    setupFiles: ['./vitest.setup.ts'],

    // Globals
    globals: true,

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // `include` alone reports on the whole source tree, not just the files a
      // test happens to import. Without it, coverage % would be computed over a
      // handful of files and the thresholds below would guard almost nothing.
      include: ['app/**', 'components/**', 'hooks/**', 'lib/**'],
      exclude: [
        'node_modules/',
        '.next/',
        'dist/',
        'build/',
        '*.config.*',
        '*.d.ts',
        'coverage/',
        'public/',
        'test/**',
        '**/__tests__/**',
        // Presentational/layout shells and static assets: no logic to unit test.
        'app/**/layout.tsx',
        'app/**/page.tsx',
        'app/**/opengraph-image.tsx',
        'app/**/icon*.{ts,tsx}',
        'app/**/manifest.json',
        'app/globals.css',
      ],
      // Realistic floor that the current suite clears. Ratchet upward as more
      // logic gets covered — do not lower it. NB: Vitest expects these keys at
      // the top level of `thresholds`; nesting them under `global` (the old
      // nyc/istanbul style) silently disables the gate.
      thresholds: {
        branches: 14,
        functions: 15,
        lines: 17,
        statements: 17,
      },
    },

    // File patterns
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules/', '.next/', 'dist/', 'build/', 'e2e/', '.tmp/'],

    // Timeout
    testTimeout: 10000,

    // Pool options
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },

    // Reporter. `github-actions` annotates failures inline on the pull request
    // diff; `default` keeps the run readable in the job log.
    reporters: process.env['CI'] ? ['default', 'github-actions'] : ['verbose'],

    // Logging
    logHeapUsage: true,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      // `content-collections` is generated at build time and absent in tests.
      // Alias to a stub so modules importing it (e.g. sitemap) can be tested;
      // tests that need real posts override it via `vi.mock`.
      'content-collections': resolve(__dirname, './test/stubs/content-collections.ts'),
    },
  },
});
