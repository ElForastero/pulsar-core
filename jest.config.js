module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transformIgnorePatterns: ['node_modules/(?!react-native)/'],
  testRegex: '\\.test\\.tsx?$',
  testEnvironment: 'jsdom',
};
