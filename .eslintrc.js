module.exports = {
  root: true,

  env: {
    browser: true,
    es6: true,
    node: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],

  parser: '@typescript-eslint/parser',

  plugins: [
    '@typescript-eslint',
  ],

  rules: {
  }
};
