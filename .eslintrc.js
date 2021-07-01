module.exports = {
  root: true,

  env: {
    browser: true,
    es6: true,
    node: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  parser: '@typescript-eslint/parser',

  plugins: [
    '@typescript-eslint',
  ],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },

  rules: {
  }
};
