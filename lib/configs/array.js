'use strict';

var $tatic = require('../static');
var define = require('@fav/prop.define');
var override = define.override;

override($tatic, function addValueOptionByConfig(result, config, option,
    value) {
  if (!config.array) {
    addValueOptionByConfig.$uper(result, config, option, value);
    return;
  }

  var name = config.alias[0];
  var arr = result.options[name];
  if (!arr) {
    arr = [];
  }
  arr.push(value);
  config.alias.forEach(function(name) {
    result.options[name] = arr;
  });
});
