module.exports = {
  root: true,
  extends: ['@spaceship/eslint-config/native'],
  rules: {
    // false positives on types
    '@typescript-eslint/no-unused-vars': 'off',
  },
};
