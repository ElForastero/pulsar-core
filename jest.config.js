module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['js', 'ts'],
  transformIgnorePatterns: ['node_modules/(?!react-native)/'],
  testRegex: '\\.test\\.ts$',
  testEnvironment: 'jsdom',
};
