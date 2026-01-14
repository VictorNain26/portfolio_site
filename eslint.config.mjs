import { defineConfig, globalIgnores } from 'eslint/config';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

/**
 * ESLint Flat Config for Next.js 15 + TypeScript
 * @see https://nextjs.org/docs/app/api-reference/config/eslint
 * @see https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/
 */
export default defineConfig([
  // Global ignores
  globalIgnores([
    '.next/**',
    'out/**',
    'dist/**',
    'build/**',
    'coverage/**',
    'node_modules/**',
    '.content-collections/**',
    'next-env.d.ts',
  ]),

  // TypeScript files configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ─────────────────────────────────────────────────────────────────────
      // Next.js rules (from core-web-vitals)
      // ─────────────────────────────────────────────────────────────────────
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // ─────────────────────────────────────────────────────────────────────
      // TypeScript
      // ─────────────────────────────────────────────────────────────────────
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-empty-object-type': 'off', // Allow {} for React props

      // ─────────────────────────────────────────────────────────────────────
      // React & Hooks
      // ─────────────────────────────────────────────────────────────────────
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off', // Using TypeScript
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: 'last',
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
      'react/self-closing-comp': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // ─────────────────────────────────────────────────────────────────────
      // Code quality
      // ─────────────────────────────────────────────────────────────────────
      'no-console': ['error', { allow: ['error', 'warn'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
    },
  },

  // Test files - relaxed rules
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  // Prettier must be last to override formatting rules
  prettierConfig,
]);
