import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single']
    }
  }
];
