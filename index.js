'use strict';

var isArray = require('@fav/type.is-array');
var parse = require('./lib');

function parseArgv(argv, configs) {
  if (!isArray(argv)) {
    configs = argv;
    argv = process.argv.slice(2);
  }
  return parse(argv, configs);
}

module.exports = parseArgv;
