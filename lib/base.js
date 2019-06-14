'use strict';

var $tatic = require('./static');
var define = require('@fav/prop.define');
var override = define.override;
var toNumber = require('@fav/type.to-number');

override($tatic, function create() {
  return {
    args: [],
    options: {},
  };
});

override($tatic, function parse(result, arg, i /*, argv*/) {
  $tatic.addArgument(result, $tatic.toNumberIfPossible(arg));
  return i + 1;
});

override($tatic, function end(result) {
  return result;
});

override($tatic, function addArgument(result, arg) {
  result.args.push(arg);
});

override($tatic, function toNumberIfPossible(value) {
  var numValue = toNumber(value);
  if (!isNaN(numValue)) {
    return numValue;
  }
  return value;
});
