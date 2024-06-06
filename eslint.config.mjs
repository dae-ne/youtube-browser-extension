import globals from 'globals';
import pluginJs from '@eslint/js';

const { node, browser, webextensions } = globals;

export default [
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' }
  },
  {
    files: ['extension/**/*.js'],
    languageOptions: { globals: { ...browser, ...webextensions } }
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: { globals: node }
  },
  pluginJs.configs.recommended,
];
