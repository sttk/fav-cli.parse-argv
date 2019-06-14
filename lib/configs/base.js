'use strict';

var $tatic = require('../static');
var define = require('@fav/prop.define');
var override = define.override;

override($tatic, function create(configs) {
  var result = create.$uper();
  result.configs = $tatic.parseConfigs(configs);
  return result;
});

override($tatic, function end(result) {
  var result = end.$uper(result);
  return {
    args: result.args,
    options: result.options,
  };
});

override($tatic, function parseConfigs(/* configs */) {
  return {};
});
