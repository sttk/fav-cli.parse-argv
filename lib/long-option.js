'use strict';

var toNumber = require('@fav/type.to-number');
var factory = require('./result-factory');

function addLongOption(result, arg, nextArg) {
  var option = arg.slice(2);

  var equation = /^([^=]+)=(.*)$/.exec(option);
  if (equation) {
    factory.addOriginalAndCamelCaseOption(result, equation[1], equation[2]);
    return 0;
  }

  if (/^no-/.test(option)) {
    option = option.slice(3);
    factory.addOriginalAndCamelCaseOption(result, option, false);
    return 0;
  }

  var value = factory.toOptionValue(nextArg);
  if (value != null) {
    factory.addOriginalAndCamelCaseOption(result, option, value);
    return 1;
  }

  factory.addOriginalAndCamelCaseOption(result, option, true);
  return 0;
}

module.exports = {
  add: addLongOption,
};
