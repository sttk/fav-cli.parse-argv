'use strict';

var enumOwnKeys = require('@fav/prop.enum-own-keys');
var assign = require('@fav/prop.assign');
var isString = require('@fav/type.is-string');
var camelCase = require('@fav/text.camel-case');
var kebabCase = require('@fav/text.kebab-case');
var $tatic = require('../static');
var define = require('@fav/prop.define');
var override = define.override;

override($tatic, function parseConfigs(configs) {
  var parsed = parseConfigs.$uper(configs);

  parsed.longOptions = {};
  parsed.shortOptions = {};

  var options = enumOwnKeys(configs);
  var duplicated = {};
  for (var i = 0, n = options.length; i < n; i++) {
    var option = options[i];
    var config = assign({}, configs[option]);
    $tatic.parseEachConfig(parsed, option, config, duplicated);
  }

  return parsed;
});

override($tatic, function parseEachConfig(parsed, option, config, duplicated) {
  config.alias = $tatic.arrangeAliases(option, config.alias, duplicated);
  $tatic.divideLongAndShortOptions(config, parsed);
});

override($tatic, function arrangeAliases(option, aliases, duplicated) {
  var names = [option].concat(aliases).filter(isString);

  var aliasesMap = {};
  for (var i = 0, n = names.length; i < n; i++) {
    var name = names[i];
    if (name.length === 1) {
      $tatic.createShortOptionAliasesMap(name, aliasesMap, duplicated);
    } else {
      $tatic.createLongOptionAliasesMap(name, aliasesMap, duplicated);
    }
  }

  // Put the config keyname to first
  delete aliasesMap[option];
  var arranged = enumOwnKeys(aliasesMap);
  arranged.unshift(option);

  return arranged;
});

override($tatic, function createShortOptionAliasesMap(name, aliasesMap,
    duplicated) {
  if (duplicated[name]) {
    var e = new Error();
    e.option = name;
    e.reason = 'duplicatedNameOrAlias';
    e.message = JSON.stringify(e);
    throw e;
  }
  duplicated[name] = true;
  aliasesMap[name] = true;
});

override($tatic, function createLongOptionAliasesMap(name, aliasesMap,
    duplicated) {
  var camelCaseName = camelCase(name);
  if (duplicated[camelCaseName]) {
    var e = new Error();
    e.option = name;
    e.reason = 'duplicatedNameOrAlias';
    e.message = JSON.stringify(e);
    throw e;
  }
  duplicated[camelCaseName] = true;

  aliasesMap[name] = true;
  if (camelCaseName !== name) {
    aliasesMap[camelCaseName] = true;
  }

  var kebabCaseName = kebabCase(name);
  if (kebabCaseName !== camelCaseName && kebabCaseName !== name) {
    aliasesMap[kebabCaseName] = true;
  }
});

override($tatic, function divideLongAndShortOptions(config, parsed) {
  for (var i = 0, n = config.alias.length; i < n; i++) {
    var name = config.alias[i];
    if (name.length === 1) {
      parsed.shortOptions[name] = config;
    } else {
      parsed.longOptions[camelCase(name)] = config;
    }
  }
});
