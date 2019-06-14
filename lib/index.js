'use strict';

var $tatic = require('./static');

require('./base');
require('./option');
require('./long-option');
require('./short-option');
require('./not-flag');
require('./configs');

function parse(argv, configs) {
  var result = $tatic.create(configs);
  for (var i = 0;
       i < argv.length;
       i = $tatic.parse(result, argv[i], i, argv)) {}
  return $tatic.end(result);
}

module.exports = parse;
