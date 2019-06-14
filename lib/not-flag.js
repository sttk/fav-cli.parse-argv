'use strict';

var $tatic = require('./static');
var define = require('@fav/prop.define');
var override = define.override;

override($tatic, function parse(result, arg, i, argv) {
  if ($tatic.isNotFlag(arg)) {
    $tatic.addAllArgumentsAfterNotFlag(result, i, argv);
    return argv.length;
  }
  return parse.$uper(result, arg, i, argv);
});

override($tatic, function isNotFlag(arg) {
  return (arg === '--');
});

override($tatic, function addAllArgumentsAfterNotFlag(result, i, argv) {
  for (i += 1; i < argv.length; i++) {
    $tatic.addArgument(result, $tatic.toNumberIfPossible(argv[i]));
  }
  return argv.length;
});
