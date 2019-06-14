'use strict';

var $tatic = require('../static');
var define = require('@fav/prop.define');
var override = define.override;

override($tatic, function addNumberOptionByConfig(result, config, option,
    valueOrig) {
  if (config.requiresArg && valueOrig == null) {
    var e = new Error();
    e.option = option;
    e.reason = 'noRequiredArg';
    e.message = JSON.stringify(e);
    throw e;
  }
  addNumberOptionByConfig.$uper(result, config, option, valueOrig);
});

override($tatic, function addStringOptionByConfig(result, config, option,
   valueOrig) {
  if (config.requiresArg && valueOrig == null) {
    var e = new Error();
    e.option = option;
    e.reason = 'noRequiredArg';
    e.message = JSON.stringify(e);
    throw e;
  }
  addStringOptionByConfig.$uper(result, config, option, valueOrig);
});

override($tatic, function addUnknownTypeOptionByConfig(result, config, option,
    value, valueOrig) {
  if (config.requiresArg && valueOrig == null) {
    var e = new Error();
    e.option = option;
    e.reason = 'noRequiredArg';
    e.message = JSON.stringify(e);
    throw e;
  }
  addUnknownTypeOptionByConfig.$uper(result, config, option, value, valueOrig);
});
