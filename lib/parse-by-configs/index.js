'use strict';

var factory = require('../result-factory');
var parseConfigs = require('./parse-configs');
var checkUnused = require('./check-unused');
var addShortOption = require('./short-option').add;
var addLongOption = require('./long-option').add;

function parse(args, configs) {
  configs = parseConfigs(configs);

  var result = factory.create();

  for (var i = 0, n = args.length; i < n; i++) {
    var arg = args[i];

    var value = factory.toOptionValue(arg);
    if (value != null) {
      factory.addNormalArg(result, value);

    } else if (arg === '--') {
      factory.addAllArgsAfterNotFlag(result, args, i);
      break;

    } else if (arg[1] === '-') {
      i += addLongOption(result, arg, i, args, configs.long);

    } else {
      i += addShortOption(result, arg, i, args, configs.short);
    }
  }

  checkUnused(result, configs.default);

  return result;
}

module.exports = parse;
