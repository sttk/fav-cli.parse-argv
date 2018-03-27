'use strict';

var factory = require('./result-factory');
var addLongOptionInDefault = require('../long-option').add;

function addLongOption(result, arg, argIndex, args, configs) {
  var option = arg.slice(2);

  var equation = /^([^=]+)=(.*)$/.exec(option);
  if (equation) {
    option = equation[1];
  }

  var config = configs[option], value;

  var falseOption = false;
  if (!config && /^no-/.test(option)) {
    config = configs[option.slice(3)];
    falseOption = true;
  }

  if (!factory.isValidConfig(config)) {
    return addLongOptionInDefault(result, arg, args[argIndex + 1]);
  }

  if (equation) {
    value = equation[2];
    value = factory.configureValue[config.type](option, config, value);
    factory.addTypedOption[config.type](result, config, value);
    return 0;
  }

  if (falseOption) {
    value = factory.configureValue[config.type](option, config, false);
    factory.addTypedOption[config.type](result, config, value);
    return 0;
  }

  value = factory.getOptionValue(config, argIndex, args);
  value = factory.configureValue[config.type](option, config, value);
  return factory.addTypedOption[config.type](result, config, value);
}

module.exports = {
  add: addLongOption,
};
