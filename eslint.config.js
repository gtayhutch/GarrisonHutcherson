// ESLint flat config (STY-01, Google TypeScript style):
// typescript-eslint strict-type-checked for TypeScript, eslint-plugin-astro
// for components, plus rules for TS-03, TS-07, TS-09, TS-14, and TS-18.
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import {defineConfig} from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: [
      'dist/',
      '.astro/',
      '.wrangler/',
      'node_modules/',
      'playwright-report/',
      'test-results/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      globals: {...globals.node},
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TS-18: strict equality, except `== null`.
      eqeqeq: ['error', 'always', {null: 'ignore'}],
      // TS-14: no suppressions at all in production code.
      '@typescript-eslint/ban-ts-comment': 'error',
      // TS-09: no `any`.
      '@typescript-eslint/no-explicit-any': 'error',
      // TS-07: no `I` prefix on interfaces.
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {regex: '^I[A-Z]', match: false},
        },
      ],
    },
  },
  {
    // TS-03: named exports only, outside framework/tool config files.
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Use named exports (TS-03).',
        },
      ],
    },
  },
  ...astro.configs.recommended,
  {
    // Type-aware rules need a TS program; config files and Astro components
    // are checked by `astro check` instead.
    files: ['**/*.js', '**/*.mjs', '**/*.astro'],
    ...tseslint.configs.disableTypeChecked,
  },
]);
