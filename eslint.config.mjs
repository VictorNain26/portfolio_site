import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import eslintReact from '@eslint-react/eslint-plugin';
import tseslint from 'typescript-eslint';
import oxlint from 'eslint-plugin-oxlint';
import prettierConfig from 'eslint-config-prettier';

/**
 * ESLint flat config — Next.js 16 + React 19 + TypeScript (ESLint 10).
 *
 * Dual-linter setup : Oxlint (.oxlintrc.json) gère la passe rapide de
 * correctness ; ESLint se concentre sur ce qu'Oxlint ne couvre pas encore —
 * règles Next.js, react-hooks (exhaustive-deps) et règles React type-aware.
 * `eslint-plugin-oxlint` (placé en dernier) éteint côté ESLint toute règle
 * déjà active dans Oxlint pour éviter le double rapport.
 *
 * `eslint-plugin-react` est remplacé par `@eslint-react/eslint-plugin`, son
 * successeur réécrit en TS (support React 19 + ESLint 10).
 *
 * @see https://nextjs.org/docs/app/api-reference/config/eslint
 * @see https://eslint-react.xyz
 * @see https://oxc.rs/docs/guide/usage/linter
 */
export default defineConfig([
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

  // Recommandations de base ESLint (tous fichiers).
  js.configs.recommended,

  // Fichiers de config Node (next.config.js, postcss.config.js…) : globals Node.
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // TypeScript + React, analyse type-aware, restreint aux sources TS/TSX.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended, eslintReact.configs['recommended-typescript']],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // projectService fournit les infos de type aux règles type-aware.
        // allowDefaultProject couvre les fichiers de config hors tsconfig.
        projectService: {
          allowDefaultProject: ['*.config.{ts,mts,cts}'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // Next.js (core-web-vitals).
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // React Hooks (exhaustive-deps non couvert par Oxlint).
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'error',

      // TypeScript — durcissements maison.
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
      '@typescript-eslint/no-empty-object-type': 'off', // {} autorisé pour les props React

      // Qualité de code.
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

  // Fichiers de test — règles assouplies.
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  // Scripts JSON-LD : dangerouslySetInnerHTML est volontaire et sûr ici
  // (données structurées sérialisées par nos soins, jamais d'entrée externe).
  {
    files: ['**/*JsonLd*.tsx', '**/JsonLdScripts.tsx'],
    rules: {
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
    },
  },

  // Éteint les règles ESLint déjà couvertes par Oxlint (doit venir après les
  // définitions de règles, avant Prettier).
  ...oxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  // Prettier en dernier : neutralise les règles de formatage.
  prettierConfig,
]);
