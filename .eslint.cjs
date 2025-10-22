module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  extends: ['eslint:recommended', '@vue/eslint-config-typescript', '@vue/eslint-config-prettier'],
  rules: {
    'vue/multi-word-component-names': 'off'
  }
};
