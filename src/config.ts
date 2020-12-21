// @preval
const { lilconfigSync } = require('lilconfig');

const configResult = lilconfigSync('pulsar', {
  searchPlaces: ['.pulsar.json', '.pulsar.js', '.pulsar.config.json', '.pulsar.config.js'],
}).search();

if (configResult === null) {
  throw new Error('[@pulsar/core]: No config file');
}

module.exports = configResult.config;
