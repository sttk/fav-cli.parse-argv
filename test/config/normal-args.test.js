'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Normal arguments', function() {
  it('Should parse an empty argv and no config', function() {
    var configs = {};
    expect(parse([], configs)).to.deep.equal({
      options: {},
      args: [],
    });
  });
});
