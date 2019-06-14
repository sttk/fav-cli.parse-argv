'use strict';

var $tatic = require('../static');
var define = require('@fav/prop.define');
var override = define.override;
var enumOwnKeys = require('@fav/prop.enum-own-keys');

override($tatic, function create(configs) {
  var result = create.$uper(configs);

  var demanded = [];
  enumOwnKeys(configs).forEach(function(name) {
    if (configs[name].demandOption) {
      demanded.push(name);
    }
  });
  result.configs.demanded = demanded;

  return result;
});

override($tatic, function end(result) {
  result.configs.demanded.forEach(function(name) {
    if (result.options[name] == null) {
      var e = new Error();
      e.option = name;
      e.reason = 'noDemandedOption';
      e.message = JSON.stringify(e);
      throw e;
    }
  });
  return end.$uper(result);
});
