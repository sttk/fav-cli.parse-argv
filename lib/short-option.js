'use strict';

var $tatic = require('./static');
var define = require('@fav/prop.define');
var override = define.override;
var toNumber = require('@fav/type.to-number');

override($tatic, function parse(result, arg, i, argv) {
  if ($tatic.isShortOption(arg)) {
    for (var j = 1; j < arg.length - 1; j++) {
      if ($tatic.parseShortOption(result, arg[j], arg.slice(j + 1))) {
        return i + 1;
      }
    }
    var last = arg.length - 1;
    return i + 1 + $tatic.parseLastShortOption(result, arg[last], argv[i + 1]);
  }
  return parse.$uper(result, arg, i, argv);
});

override($tatic, function isShortOption(arg) {
  if (isNaN(toNumber(arg))) {
    return /^(-[^-]|--[^-]$)/.test(arg);
  }
  return false;
});

override($tatic, function parseShortOption(result, option, following) {
  if ($tatic.isIgnoredCharacter(option)) {
    return 0;
  }

  if (following[0] === '=') {
    following = following.slice(1);
    var value = $tatic.toNumberIfPossible(following);
    $tatic.addShortOption(result, option, value, following);
    return 1;
  }

  var numValue = toNumber(following);
  if (!isNaN(numValue)) {
    return $tatic.addShortOption(result, option, numValue, following);
  }

  $tatic.addShortOption(result, option, true);
  return 0;
});

override($tatic, function addShortOption(result, option, value
    /* , valueOrig */) {
  $tatic.addOption(result, option, value);
  return 1;
});

override($tatic, function isIgnoredCharacter(c) {
  // Ignore control codes, marks, and numbers.
  return /[\0-@[-`{-~]/.test(c);
});

override($tatic, function parseLastShortOption(result, option, nextArg) {
  if ($tatic.isIgnoredCharacter(option)) {
    return 0;
  }

  if (nextArg == null || $tatic.isOption(nextArg)) {
    $tatic.addShortOption(result, option, true);
    return 0;
  }

  var value = $tatic.toNumberIfPossible(nextArg);
  return $tatic.addShortOption(result, option, value, nextArg);
});

override($tatic, function isOption(arg) {
  return $tatic.isShortOption(arg) || isOption.$uper(arg);
});
