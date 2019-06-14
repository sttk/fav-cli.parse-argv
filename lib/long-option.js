'use strict';

var $tatic = require('./static');
var define = require('@fav/prop.define');
var override = define.override;
var camelCase = require('@fav/text.camel-case');
var kebabCase = require('@fav/text.kebab-case');
var toNumber = require('@fav/type.to-number');

override($tatic, function parse(result, arg, i, argv) {
  if ($tatic.isLongOption(arg)) {
    return i + 1 + $tatic.parseLongOption(result, arg.slice(2), argv[i + 1]);
  }
  return parse.$uper(result, arg, i, argv);
});

override($tatic, function isLongOption(arg) {
  return /^--./.test(arg);
});

override($tatic, function parseLongOption(result, option, nextArg) {
  var nooption = /^no-([^=]+)/.exec(option);
  if (nooption) {
    $tatic.addLongNoOption(result, nooption[1]);
    return 0;
  }

  var equation = /^([^=]+)=(.*)$/.exec(option);
  if (equation) {
    var value = $tatic.toNumberIfPossible(equation[2]);
    $tatic.addLongOption(result, equation[1], value, equation[2]);
    return 0;
  }

  if (nextArg == null) {
    $tatic.addLongOption(result, option, true);
    return 0;
  }

  var numArg = toNumber(nextArg);
  if (!isNaN(numArg)) {
    return $tatic.addLongOption(result, option, numArg, nextArg);
  }

  if (!$tatic.isOption(nextArg)) {
    return $tatic.addLongOption(result, option, nextArg, nextArg);
  }

  $tatic.addLongOption(result, option, true);
  return 0;
});

override($tatic, function isOption(arg) {
  return $tatic.isLongOption(arg) || isOption.$uper(arg);
});

override($tatic, function addLongOption(result, name, value, valueSource) {
  $tatic.addOption(result, name, value);

  var camelCaseName = camelCase(name);
  if (camelCaseName && camelCaseName.length !== name.length) {
    $tatic.addOption(result, camelCaseName, value);

  } else {
    var kebabCaseName = kebabCase(name);
    if (kebabCaseName && kebabCaseName.length !== name.length) {
      $tatic.addOption(result, kebabCaseName, value);
    }
  }

  return (valueSource == null) ? 0 : 1;
});

override($tatic, function addLongNoOption(result, name) {
  $tatic.addLongOption(result, name, false);
});
