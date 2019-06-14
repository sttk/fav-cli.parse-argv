'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Normal arguments', function() {

  it('Should parse an empty argv', function() {
    expect(parse([])).to.deep.equal({
      options: {},
      args: [],
    });
  });

  it('Should parse argv which has only normal arguments', function() {
    expect(parse(['abc', 'def', 'ghi'])).to.deep.equal({
      options: {},
      args: ['abc', 'def', 'ghi'],
    });
  });

  it('Should parse argv which has number arguments', function() {
    expect(parse(['123', '-123', '.1', '-.1', '.'])).to.deep.equal({
      options: {},  // Marks are ignored as options
      args: [123, -123, 0.1, -0.1, '.'],
    });
  });

  it('Should deal with \'-\' as a normal arg', function() {
    expect(parse(['-', 'def'])).to.deep.equal({
      options: {},
      args: ['-', 'def'],
    });
    expect(parse(['abc', '-', 'def'])).to.deep.equal({
      options: {},
      args: ['abc', '-', 'def'],
    });
    expect(parse(['abc', '-'])).to.deep.equal({
      options: {},
      args: ['abc', '-'],
    });
  });

});
