'use strict';

var $tatic = require('../static');
var define = require('@fav/prop.define');
var override = define.override;
var toNumber = require('@fav/type.to-number');
var isNumber = require('@fav/type.is-finite-number');
var camelCase = require('@fav/text.camel-case');

override($tatic, function addShortOption(result, option, value, valueOrig) {
  var config = result.configs.shortOptions[option];
  if (config) {
    switch (config.type) {
      case 'boolean': {
        if (typeof value !== 'boolean') {
          value = true;
        }
        $tatic.addValueOptionByConfig(result, config, option, value);
        return 0;
      }
      case 'number': {
        $tatic.addNumberOptionByConfig(result, config, option, valueOrig);
        return 1;
      }
      case 'string': {
        $tatic.addStringOptionByConfig(result, config, option, valueOrig);
        return 1;
      }
      case 'count': {
        $tatic.addCountOptionByConfig(result, config, option, 1);
        return 0;
      }
      default: {
        $tatic.addUnknownTypeOptionByConfig(result, config, option, value,
          valueOrig);
        return (valueOrig == null) ? 0 : 1;
      }
    }
  }

  return addShortOption.$uper(result, option, value, valueOrig);
});

override($tatic, function addNumberOptionByConfig(result, config, option,
    valueOrig) {
  $tatic.addValueOptionByConfig(result, config, option, toNumber(valueOrig));
});

override($tatic, function addStringOptionByConfig(result, config, option,
    valueOrig) {
  $tatic.addValueOptionByConfig(result, config, option, valueOrig || '');
});

override($tatic, function addValueOptionByConfig(result, config, option,
    value) {
  config.alias.forEach(function(name) {
    result.options[name] = value;
  });
});

override($tatic, function addCountOptionByConfig(result, config, option, inc) {
  var name = config.alias[0];
  var cnt = $tatic.countUp(result.options[name], inc);
  config.alias.forEach(function(name) {
    result.options[name] = cnt;
  });
});

override($tatic, function countUp(current, incremental) {
  if (!isNumber(current)) {
    return incremental;
  }
  return current + incremental;
});

override($tatic, function addUnknownTypeOptionByConfig(result, config, option,
    value /*, valueOrig*/) {
  $tatic.addValueOptionByConfig(result, config, option, value);
});

override($tatic, function addLongOption(result, option, value, valueOrig) {
  var config = result.configs.longOptions[camelCase(option)];
  if (config) {
    switch (config.type) {
      case 'boolean': {
        if (typeof value !== 'boolean') {
          value = true;
        }
        $tatic.addValueOptionByConfig(result, config, option, value);
        return 0;
      }
      case 'number': {
        value = toNumber(valueOrig);
        $tatic.addValueOptionByConfig(result, config, option, value);
        return 1;
      }
      case 'string': {
        $tatic.addValueOptionByConfig(result, config, option, valueOrig || '');
        return 1;
      }
      case 'count': {
        $tatic.addCountOptionByConfig(result, config, option, 1);
        return 0;
      }
      default: {
        $tatic.addValueOptionByConfig(result, config, option, value);
        return (valueOrig == null) ? 0 : 1;
      }
    }
  }

  return addLongOption.$uper(result, option, value, valueOrig);
});

override($tatic, function addLongNoOption(result, option) {
  var config = result.configs.longOptions[camelCase(option)];
  if (config) {
    switch (config.type) {
      case 'boolean': {
        $tatic.addValueOptionByConfig(result, config, option, false);
        return 0;
      }
      case 'number': {
        $tatic.addNumberOptionByConfig(result, config, option);
        return 1;
      }
      case 'string': {
        $tatic.addStringOptionByConfig(result, config, option);
        return 1;
      }
      case 'count': {
        $tatic.addCountOptionByConfig(result, config, option, -1);
        return 0;
      }
      default: {
        $tatic.addUnknownTypeOptionByConfig(result, config, option, false);
        return 0;
      }
    }
  }

  return addLongNoOption.$uper(result, option);
});
