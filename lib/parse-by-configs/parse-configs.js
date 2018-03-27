'use strict';

var enumOwnKeys = require('@fav/prop.enum-own-keys');
var isString = require('@fav/type.is-string');
var assign = require('@fav/prop.assign');
var camelCase = require('@fav/text.camel-case');
var kebabCase = require('@fav/text.kebab-case');

function parseConfigs(configs) {
  var longOptionConfigs = {};
  var shortOptionConfigs = {};
  var defaultValueConfigs = [];

  var optionNames = enumOwnKeys(configs);
  var dupDetector = {};

  for (var i = 0, n = optionNames.length; i < n; i++) {
    var name = optionNames[i];

    var config = assign({}, configs[name]);
    config.alias = arrangeAliases(name, config.alias, dupDetector);
    divideLongAndShortOptions(config, longOptionConfigs, shortOptionConfigs);

    defaultValueConfigs.push(config);
  }

  return {
    long: longOptionConfigs,
    short: shortOptionConfigs,
    default: defaultValueConfigs,
  };
}

function arrangeAliases(optionName, aliases, dupDetector) {
  var names = [optionName].concat(aliases).filter(isString);

  var aliasesMap = {};
  for (var i = 0, n = names.length; i < n; i++) {
    var name = names[i];
    if (dupDetector[name]) {
      throw new Error(JSON.stringify({
        option: name,
        reason: 'duplicatedNameOrAlias',
      }));
    }
    aliasesMap[name] = dupDetector[name] = true;

    var camelCaseName = camelCase(name);
    if (camelCaseName.length !== name.length) { // includes ignored chars.
      if (dupDetector[camelCaseName]) {
        throw new Error(JSON.stringify({
          option: camelCaseName,
          reason: 'duplicatedNameOrAlias',
        }));
      }
      aliasesMap[camelCaseName] = dupDetector[camelCaseName] = true;

    } else {
      var kebabCaseName = kebabCase(name);
      if (kebabCaseName.length !== name.length) {
        if (dupDetector[kebabCaseName]) {
          throw new Error(JSON.stringify({
            option: kebabCaseName,
            reason: 'duplicatedNameOrAlias',
          }));
        }
        aliasesMap[kebabCaseName] = dupDetector[kebabCaseName] = true;
      }
    }
  }

  // Put the config key name to first.
  delete aliasesMap[optionName];
  var result = enumOwnKeys(aliasesMap);
  result.unshift(optionName);

  return result;
}

function divideLongAndShortOptions(config, longOptions, shortOptions) {
  for (var i = 0, n = config.alias.length; i < n; i++) {
    var name = config.alias[i];
    longOptions[name] = config;

    if (name.length === 1) {
      shortOptions[name] = config;
    }
  }
}

module.exports = parseConfigs;
