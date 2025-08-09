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
      exclude: [
        'node_modules/',
        '.next/',
        'dist/',
        'build/',
        '*.config.*',
        '*.d.ts',
        'coverage/',
        'public/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // File patterns
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules/', '.next/', 'dist/', 'build/', 'e2e/', '.tmp/'],

    // Timeout
    testTimeout: 10000,

    // Watch options
    watch: true,

    // Pool options
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },

    // Reporter
    reporters: process.env['CI'] ? ['json'] : ['verbose'],

    // Logging
    logHeapUsage: true,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },

  define: {
    __APP_VERSION__: JSON.stringify(process.env['npm_package_version']),
  },
});
