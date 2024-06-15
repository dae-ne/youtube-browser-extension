import globals from 'globals';
import pluginJs from '@eslint/js';

const { node, browser, webextensions } = globals;

export default [
  {
    files: ['extension/**/*.js'],
    languageOptions: {
      globals: { ...browser, ...webextensions },
      sourceType: 'module'
    }
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: node,
      sourceType: 'commonjs'
    }
  },
  {
    ignores: ['node_modules', 'dist'],
  },
  pluginJs.configs.recommended,
];
