'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Not flag', function() {
  it('Should deal with arguments as normal args after not flag', function() {
    expect(parse([
      '-a', '-b123', '--', '-d', 'ABC', '-e=12'
    ])).to.deep.equal({
      options: { a: true, b: 123 },
      args: ['-d', 'ABC', '-e=12'],
    });

    expect(parse([
      '--', '-d', 'ABC', '-e=12'
    ])).to.deep.equal({
      options: {},
      args: ['-d', 'ABC', '-e=12'],
    });

    expect(parse(['-a', '-b123', '--'])).to.deep.equal({
      options: { a: true, b: 123 },
      args: [],
    });
  });
});
