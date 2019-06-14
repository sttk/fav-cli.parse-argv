'use strict';
var parseArgv = require('../..');
var result = parseArgv([
  'foo',
  '--log-level',
  '--port', '80', '-h', 'www.domain.com',
], {
  host: { type: 'stirng', alias: ['h'] },
  port: { type: 'number', alias: ['p'] },
  'log-level': { type: 'count', alias: 'L' },
});
console.log(JSON.stringify(result));
