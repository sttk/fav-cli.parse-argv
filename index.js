'use strict';

var isArray = require('@fav/type.is-array');
var parseInDefault = require('./lib/parse-in-default');
var parseByConfigs = require('./lib/parse-by-configs');

function parse(argv, configs) {
  if (!isArray(argv)) {
    configs = argv;
    argv = process.argv.slice(2);
  }

  return Boolean(configs) ? parseByConfigs(argv, configs) :
         parseInDefault(argv);
}

module.exports = parse;

