'use strict';

var $tatic = require('../static');
var define = require('@fav/prop.define');
var override = define.override;
var isArray = require('@fav/type.is-array');

override($tatic, function addValueOptionByConfig(result, config, option,
    value) {
  if ('choices' in config && config.type !== 'boolean') {
    if (!isArray(config.choices)) {
      config.choices = [config.choices];
    }
    if (config.choices.indexOf(value) < 0) {
      var e = new Error();
      e.option = option;
      e.reason = 'noInChoices';
      e.choices = config.choices;
      e.message = JSON.stringify(e);
      throw e;
    }
  }

  addValueOptionByConfig.$uper(result, config, option, value);
});

