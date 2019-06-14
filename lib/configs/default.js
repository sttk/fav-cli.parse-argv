'use strict';

var $tatic = require('../static');
var define = require('@fav/prop.define');
var override = define.override;
var enumOwnKeys = require('@fav/prop.enum-own-keys');
var camelCase = require('@fav/text.camel-case');

override($tatic, function end(result) {
  enumOwnKeys(result.configs.longOptions).forEach(function(name) {
    var config = result.configs.longOptions[name];
    if ('default' in config && result.options[camelCase(name)] == null) {
      $tatic.setDefaultValueByConfig(result, config);
    }
  });

  enumOwnKeys(result.configs.shortOptions).forEach(function(name) {
    var config = result.configs.shortOptions[name];
    if ('default' in config && result.options[name] == null) {
      $tatic.setDefaultValueByConfig(result, config);
    }
  });

  return end.$uper(result);
});

override($tatic, function setDefaultValueByConfig(result, config) {
  config.alias.forEach(function(name) {
    result.options[name] = config.default;
  });
});
