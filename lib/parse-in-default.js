'use strict';

var factory = require('./result-factory');
var addShortOption = require('./short-option').add;
var addLongOption = require('./long-option').add;

function parse(args) {
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
      i += addLongOption(result, arg, args[i + 1]);

    } else {
      i += addShortOption(result, arg, args[i + 1]);
    }
  }

  return result;
}

module.exports = parse;
