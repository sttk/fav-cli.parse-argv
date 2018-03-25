'use strict';

var chai = require('chai');
var expect = chai.expect;
var assignDeep = require('@fav/prop.assign-deep');

var checkUnused = require('../../lib/parse-by-configs/check-unused');

describe('lib/parse-by-configs/check-unused', function() {
  it('Should not change a result-object when no specified options',
  function() {
    var result = {
      options: {
        ab: 123,
        a: 123,
        b: 123,
        cd: 'CD',
        c: 'CD',
        d: 'CD',
      },
    };
    var configs = { default: [] };
    var expected = assignDeep({}, result);
    checkUnused(result, configs.default);
    expect(result).to.deep.equal(expected);
  });

  it('Should not change a result-object when all demand options are setted',
  function() {
    var result = {
      options: {
        ab: 123,
        a: 123,
        b: 123,
        cd: 'CD',
        c: 'CD',
        d: 'CD',
      },
    };
    var configs = {
      default: [
        { alias: ['ab', 'a', 'b'], demandedOption: true },
        { alias: ['cd', 'c', 'd'], demandedOption: true },
      ],
    };
    var expected = assignDeep({}, result);
    checkUnused(result, configs.default);
    expect(result).to.deep.equal(expected);
  });

  it('Should set default values to unused options', function() {
    var result = {
      options: {},
    };
    var configs = {
      default: [
        { alias: ['ab', 'a', 'b'], default: 'ABC' },
        { alias: ['cd', 'c', 'd'] },
        { alias: ['e'], type: 'count' },
        { alias: ['f'], type: 'array' },
      ],
    };
    var expected = {
      options: {
        ab: 'ABC', a: 'ABC', b: 'ABC',
        cd: undefined, c: undefined, d: undefined,
        e: 0,
        f: [], 
      },
    };
    checkUnused(result, configs.default);
    expect(result).to.deep.equal(expected);
  });

  it('Should throw Error when demand options are not found in a ' +
  'result-object', function() {
    var result = {
      options: {
        ab: 123,
        a: 123,
        b: 123,
      },
    };
    var configs = {
      default: [
        { alias: ['ab', 'a', 'b'], demandOption: true },
        { alias: ['cd', 'c', 'd'], demandOption: true },
      ],
    };
    var err;
    try {
      checkUnused(result, configs.default);
    } catch (e) {
      err = JSON.parse(e.message);
      expect(err.option).to.equal('cd');
      expect(err.reason).to.equal('noDemandedOption');
    }
    expect(err).to.not.be.undefined;
  });

});
