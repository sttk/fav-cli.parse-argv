'use strict';
var parseArgv = require('../..');
var result = parseArgv({
  host: { type: 'stirng', alias: ['h'] },
  port: { type: 'number', alias: ['p'] },
  'log-level': { type: 'count', alias: 'L' },
});
console.log(JSON.stringify(result));
