'use strict';

var factory = require('../result-factory');
var isArray = require('@fav/type.is-array');
var isFunction = require('@fav/type.is-function');
var toNumber = require('@fav/type.to-number');
var path = require('path');

factory.getOptionValue = function(config, argIndex, args) {
  if (config.type === 'array') {
    var arr = [];
    for (var i = argIndex + 1, n = args.length; i < n; i++) {
      var v = factory.toOptionValue(args[i]);
      if (v == null) {
        break;
      }
      arr.push(v);
    }
    return arr;
  }

  var value = args[argIndex + 1];
  if (factory.toOptionValue(value) != null) {
    return value;
  }
  return undefined;
};

factory.configureValue = {};
factory.addTypedOption = {};

factory.configureValue.boolean = function(option, config, boolValue) {
  if (typeof boolValue === 'boolean') {
    return boolValue;
  }
  return true;
};

factory.addTypedOption.boolean = function(result, config, value) {
  for (var i = 0, n = config.alias.length; i < n; i++) {
    var alias = config.alias[i];
    result.options[alias] = value;
  }
  return 0;
};

factory.configureValue.number = function(option, config, stringValue) {
  if (config.requiresArg) {
    if (stringValue == null) {
      throw new Error(JSON.stringify({
        option: option,
        reason: 'noRequiredArg',
      }));
    }
  }

  var value = toNumber(stringValue);

  var choices = config.choices;
  if (choices != null) {
    if (!isArray(choices)) {
      choices = [choices];
    }
    if (choices.indexOf(value) < 0) {
      throw new Error(JSON.stringify({
        option: option,
        reason: 'notInChoices',
        value: String(stringValue),
        choices: config.choices,
      }));
    }
  }

  if (isFunction(config.coerce)) {
    value = config.coerce(value);
  }

  return value;
};

factory.configureValue.string = function(option, config, stringValue) {
  if (config.requiresArg) {
    if (stringValue == null) {
      throw new Error(JSON.stringify({
        option: option,
        reason: 'noRequiredArg',
      }));
    }
  }

  var value = (stringValue || '');

  if (config.normalize) {
    value = path.normalize(value);
  }

  var choices = config.choices;
  if (choices != null) {
    if (!isArray(choices)) {
      choices = [choices];
    }
    if (choices.indexOf(value) < 0) {
      throw new Error(JSON.stringify({
        option: option,
        reason: 'notInChoices',
        value: String(stringValue),
        choices: config.choices,
      }));
    }
  }

  if (isFunction(config.coerce)) {
    value = config.coerce(value);
  }

  return value;
};

factory.addTypedOption.number =
factory.addTypedOption.string = function(result, config, value) {
  for (var i = 0, n = config.alias.length; i < n; i++) {
    var alias = config.alias[i];
    result.options[alias] = value;
  }
  return 1;
};

factory.configureValue.count = function(option, config, stringValue) {
  return stringValue;
}

factory.addTypedOption.count = function(result, config) {
  var count = 1;

  var alias = config.alias[0]; // Always alias is not empty
  if (alias in result.options) {
    var num = toNumber(result.options[alias]);
    count += isNaN(num) ? 1 : num;
  }

  for (var i = 0, n = config.alias.length; i < n; i++) {
    var alias = config.alias[i];
    result.options[alias] = count;
  }

  return 0;
};

factory.configureValue.array = function(option, config, arrayOrStringValue) {
  var array = arrayOrStringValue;
  if (!isArray(array)) {
    array = (array == null) ? [] : [array];
  }

  if (config.requiresArg) {
    if (array.length === 0) {
      throw new Error(JSON.stringify({
        option: option,
        reason: 'noRequiredArg',
      }));
    }
  }

  var choices = config.choices;
  if (choices != null) {
    if (!isArray(choices)) {
      choices = [choices];
    }
  }

  var coerce = isFunction(config.coerce) ? config.coerce : noop;

  for (var i = 0, n = array.length; i < n; i++) {
    var elem = factory.convertToNumberIfPossible(array[i]);

    if (choices && choices.indexOf(elem) < 0) {
      throw new Error(JSON.stringify({
        option: option,
        reason: 'notInChoices',
        value: array[i],
        choices: config.choices,
      }));
    }

    array[i] = coerce(elem);
  }

  return array;
};

function noop(v) {
  return v;
}

factory.addTypedOption.array = function(result, config, arrayValue) {
  var array = arrayValue;
  var alias = config.alias[0]; // Always alias is not empty
  if (alias in result.options) {
    var v = result.options[alias];
    if (!isArray(v)) {
      v = [v];
    }
    array = v.concat(array);
  }

  for (var i = 0, n = config.alias.length; i < n; i++) {
    alias = config.alias[i];
    result.options[alias] = array;
  }

  return arrayValue.length;
};

factory.isValidConfig = function(config) {
  return Boolean(config) && Boolean(factory.addTypedOption[config.type]);
}

factory.default = {};
factory.default.boolean = false;
factory.default.number = 0;
factory.default.string = '';
factory.default.count = 0;
factory.default.array = [];

module.exports = factory;
