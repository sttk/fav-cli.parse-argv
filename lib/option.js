'use strict';

var $tatic = require('./static');
var define = require('@fav/prop.define');
var override = define.override;
var isArray = require('@fav/type.is-array');

override($tatic, function addOption(result, name, value) {
  if (name in result.options) {
    var oldValue = result.options[name];
    if (isArray(oldValue)) {
      oldValue.push(value);
      return;
    }
    result.options[name] = [oldValue, value];
    return;
  }
  result.options[name] = value;
});

override($tatic, function isOption(/* arg */) {
  return false;
});
