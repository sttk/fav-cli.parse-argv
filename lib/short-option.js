'use strict';

var toNumber = require('@fav/type.to-number');
var factory = require('./result-factory');

function addShortOption(result, arg, nextArg) {
  for (var i = 1, n = arg.length; i < n; i++) {
    var argIndexIncrement = addEachOfShortOption(result, i, arg, nextArg);
    if (argIndexIncrement >= 0) {
      return argIndexIncrement;
    }
  }
  return 0;
}

function addEachOfShortOption(result, index, arg, nextArg) {
  var option = arg[index];

  if (factory.isIgnoredCharacter(option)) {
    return -1;
  }

  if (index === arg.length - 1) {
    return addLastOfShortOption(result, option, nextArg);
  }

  if (arg[index + 1] === '=') {
    factory.addOption(result,option, arg.slice(index + 2));
    return 0;
  }

  var num = toNumber(arg.slice(index + 1));
  if (!isNaN(num)) {
    factory.addOption(result, option, num);
    return 0;
  }

  factory.addOption(result, option, true);
  return -1;
}

function addLastOfShortOption(result, option, nextArg) {
  var value = factory.toOptionValue(nextArg);
  if (value != null) {
    factory.addOption(result, option, value);
    return 1;
  }

  factory.addOption(result, option, true);
  return 0;
}

module.exports = {
  add: addShortOption,
  addEachOf: addEachOfShortOption,
  addLastOf: addLastOfShortOption,
};
