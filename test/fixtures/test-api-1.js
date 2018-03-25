'use strict';
var parseArgv = require('../..');
var result = parseArgv([
  'foo',
  '-aB123',
  '--cde-fgh', 'ijk',
]);
console.log(JSON.stringify(result));
