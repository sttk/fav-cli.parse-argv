'use strict';

var toNumber = require('@fav/type.to-number');
var factory = require('./result-factory');
var shortOptionInDefault = require('../short-option');
var addEachOfShortOptionInDefault = shortOptionInDefault.addEachOf;
var addLastOfShortOptionInDefault = shortOptionInDefault.addLastOf;

function addShortOption(result, arg, argIndex, args, configs) {
  for (var i = 1, n = arg.length; i < n; i++) {
    var option = arg[i];
    var config = configs[option];

    var argIndexIncrement = factory.isValidConfig(config) ?
      addEachOfShortOption(result, i, arg, argIndex, args, config) :
      addEachOfShortOptionInDefault(result, i, arg, args[argIndex + 1]);

    if (argIndexIncrement >= 0) {
      return argIndexIncrement;
    }
  }

  return 0;
}

function addEachOfShortOption(result, index, arg, argIndex, args, config) {
  var option = arg[index], value;

  if (index === arg.length - 1) {
    return addLastOfShortOption(result, option, argIndex, args, config);
  }

  if (arg[index + 1] === '=') {
    value = arg.slice(index + 2);
    value = factory.configureValue[config.type](option, config, value);
    factory.addTypedOption[config.type](result, config, value);
    return 0;
  }

  value = arg.slice(index + 1);
  if (!isNaN(toNumber(value))) {
    value = factory.configureValue[config.type](option, config, value);
    factory.addTypedOption[config.type](result, config, value);
    return 0;
  }

  value = factory.configureValue[config.type](option, config);
  factory.addTypedOption[config.type](result, config, value);
  return -1;
}

function addLastOfShortOption(result, option, argIndex, args, config) {
  var value = factory.getOptionValue(config, argIndex, args);
  value = factory.configureValue[config.type](option, config, value);
  return factory.addTypedOption[config.type](result, config, value);
}

module.exports = {
  add: addShortOption,
};
