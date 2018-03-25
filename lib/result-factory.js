'use strict';

var isArray = require('@fav/type.is-array');
var isString = require('@fav/type.is-string');
var toNumber = require('@fav/type.to-number');
var camelCase = require('@fav/text.camel-case');

function create() {
  return {
    options: {},
    args: [],
  };
}

function isIgnoredCharacter(c) {
  // Ignore control codes, marks, and numbers.
  return /[\0-@[-`{-~]/.test(c);
}

function toOptionValue(arg) {
  var numArg = toNumber(arg);
  if (!isNaN(numArg)) {
    return numArg;
  }

  if (/^-{1,2}[^-].*/.test(arg)) {
    return undefined;
  }

  if (arg === '--') {
    return undefined;
  }

  return arg;
}

function addNormalArg(result, arg) {
  result.args.push(arg);
}

function addAllArgsAfterNotFlag(result, args, notFlagIndex) {
  for (var i = notFlagIndex + 1, n = args.length; i < n; i++) {
    addNormalArg(result, convertToNumberIfPossible(args[i]));
  }
}

function addOption(result, name, value) {
  if (!name) {
    return;
  }

  if (isString(value)) {
    value = convertToNumberIfPossible(value);
  }

  if (!(name in result.options)) {
    result.options[name] = value;
    return;
  }

  var v = result.options[name];
  if (isArray(v)) {
    v.push(value);
    return;
  }

  result.options[name] = [v, value];
}

function addOriginalAndCamelCaseOption(result, name, value) {
  addOption(result, name, value);

  var camelCaseName = camelCase(name);
  if (camelCaseName.length !== name.length) {
    addOption(result, camelCaseName, value);
  }
}

function convertToNumberIfPossible(value) {
  var num = toNumber(value);
  if (!isNaN(num)) {
    return num;
  }
  return value;
}

module.exports = {
  create: create,
  isIgnoredCharacter: isIgnoredCharacter,
  toOptionValue: toOptionValue,
  addNormalArg: addNormalArg,
  addAllArgsAfterNotFlag: addAllArgsAfterNotFlag,
  addOption: addOption,
  addOriginalAndCamelCaseOption: addOriginalAndCamelCaseOption,
  convertToNumberIfPossible: convertToNumberIfPossible,
};
