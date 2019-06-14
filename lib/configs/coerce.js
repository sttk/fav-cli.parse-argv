'use strict';

var $tatic = require('../static');
var define = require('@fav/prop.define');
var override = define.override;
var isFunction = require('@fav/type.is-function');

override($tatic, function create(configs) {
  var result = create.$uper(configs);
  result.counts = {};
  return result;
});

override($tatic, function addValueOptionByConfig(result, config, option,
    value) {
  if (isFunction(config.coerce)) {
    value = config.coerce(value, config, option);
  }
  addValueOptionByConfig.$uper(result, config, option, value);
});

override($tatic, function addCountOptionByConfig(result, config, option, inc) {
  if (isFunction(config.coerce)) {
    var name = config.alias[0];
    var cnt = result.counts[name] = $tatic.countUp(result.counts[name], inc);
    cnt = config.coerce(cnt, config, option);
    config.alias.forEach(function(name) {
      result.options[name] = cnt;
    });
    return;
  }
  addCountOptionByConfig.$uper(result, config, option, inc);
});
