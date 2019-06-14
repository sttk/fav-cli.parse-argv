'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Requires argument', function() {
  it('Should cause an error if a number option is not specified value',
  function() {
    var configs = {
      'ab-cd': { type: 'number', alias: 'a',  requiresArg: true },
    };
    try {
      parse(['-a'], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('a');
      expect(e.reason).to.equal('noRequiredArg');
    }
  });

  it('Should cause an error if a string option is not specified value',
  function() {
    var configs = {
      'ab-cd': { type: 'string', alias: 'a', requiresArg: true },
    };
    try {
      parse(['-a'], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('a');
      expect(e.reason).to.equal('noRequiredArg');
    }
  });

  it('Should not cause an error if a boolean option is not specified value',
  function() {
    var configs = {
      a: { type: 'boolean', requiresArg: true },
    };
    expect(parse(['-a'], configs)).to.deep.equals({
      args: [],
      options: {
        a: true,
      },
    });
  });

  it('Should not cause an error if a count option is not specified value',
  function() {
    var configs = {
      a: { type: 'count', requiresArg: true },
    };
    expect(parse(['-a'], configs)).to.deep.equals({
      args: [],
      options: {
        a: 1,
      },
    });
  });

  it('Should cause an error if no type option is not specified value',
  function() {
    var configs = {
      'ab-cd': { alias: 'a', requiresArg: true },
    };
    try {
      parse(['-a'], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('a');
      expect(e.reason).to.equal('noRequiredArg');
    }
  });
});
