'use strict';
var parseArgv = require('../..');
var result = parseArgv({
  bar: { type: 'boolean', alias: 'a' },
  cdeFgh: { type: 'array', alias: ['c'] },
  lmnOpq: { type: 'count' },
});
console.log(JSON.stringify(result));
