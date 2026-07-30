/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['plugin:@docusaurus/recommended'],
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: [
    'build/',
    '.docusaurus/',
    'node_modules/',
    'working-docs/',
    'gitbook-src/',
  ],
};
