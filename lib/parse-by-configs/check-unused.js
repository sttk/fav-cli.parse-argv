'use strict';

var factory = require('./result-factory');

function checkUnused(result, unusedOptionConfigs) {
  for (var i = 0, n = unusedOptionConfigs.length; i < n; i++) {
    var config = unusedOptionConfigs[i];

    var key = config.alias[0];
    if (key in result.options) {
      continue;
    }

    if (config.demandOption) {
      throw new Error(JSON.stringify({
        option: key,
        reason: 'noDemandedOption'
      }));
    }

    var defValue = ('default' in config) ? config.default :
                   factory.default[config.type];
    for (var j = 0, nj = config.alias.length; j < nj; j++) {
      key = config.alias[j];
      result.options[key] = defValue;
    }
  }
}

module.exports = checkUnused;
