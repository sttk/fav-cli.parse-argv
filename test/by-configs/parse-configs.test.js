'use strict';

var chai = require('chai');
var expect = chai.expect;

var parseConfigs = require('../../lib/parse-by-configs/parse-configs');

describe('lib/parse-by-configs/parse-configs', function() {

  it('Should return undefined when argument is empty', function() {
    var expected = { long: {}, short: {}, default: [] };
    expect(parseConfigs({})).to.deep.equal(expected);
    expect(parseConfigs(null)).to.deep.equal(expected);
    expect(parseConfigs(undefined)).to.deep.equal(expected);
  });

  it('Should set multi-char keys as a long options', function() {
    var configs = {
      ab: {},
      cde: {},
      'f-g': {},
      'hI': {},
    };
    expect(parseConfigs(configs)).to.deep.equal({
      long: {
        ab: { alias: ['ab'] },
        cde: { alias: ['cde'] },
        'f-g': { alias: ['f-g', 'fG'] },
        'fG': { alias: ['f-g', 'fG'] },
        'hI': { alias: ['hI', 'h-i'] },
        'h-i': { alias: ['hI', 'h-i'] },
      },
      short: {},
      default: [
        { alias: ['ab'] },
        { alias: ['cde'] },
        { alias: ['f-g', 'fG'] },
        { alias: ['hI', 'h-i'] },
      ],
    });
  });

  it('Should set single-char keys as short and long options', function() {
    var configs = {
      a: {},
      B: {},
    };
    expect(parseConfigs(configs)).to.deep.equal({
      long: {
        a: { alias: ['a'] },
        B: { alias: ['B'] },
      },
      short: {
        a: { alias: ['a'] },
        B: { alias: ['B'] },
      },
      default: [
        { alias: ['a'] },
        { alias: ['B'] },
      ],
    });
  });

  it('Should set multi-char aliases as long options', function() {
    var configs = {
      abc: { alias: 'def' },
      g: { alias: ['hi', 'jkLm'] },
    };
    expect(parseConfigs(configs)).to.deep.equal({
      long: {
        abc: { alias: ['abc', 'def'] },
        def: { alias: ['abc', 'def'] },
        g: { alias: ['g', 'hi', 'jkLm', 'jk-lm'] },
        hi: { alias: ['g', 'hi', 'jkLm', 'jk-lm'] },
        'jkLm': { alias: ['g', 'hi', 'jkLm', 'jk-lm'] },
        'jk-lm': { alias: ['g', 'hi', 'jkLm', 'jk-lm'] },
      },
      short: {
        g: { alias: ['g', 'hi', 'jkLm', 'jk-lm'] },
      },
      default: [
        { alias: ['abc', 'def'] },
        { alias: ['g', 'hi', 'jkLm', 'jk-lm'] },
      ],
    });
  });

  it('Should set single char aliases as short and long options', function() {
    var configs = {
      abc: { alias: 'd' },
      ef: { alias: ['g', 'h'] },
    };
    expect(parseConfigs(configs)).to.deep.equal({
      long: {
        abc: { alias: ['abc', 'd'] },
        d: { alias: ['abc', 'd'] },
        ef: { alias: ['ef', 'g', 'h'] },
        g: { alias: ['ef', 'g', 'h'] },
        h: { alias: ['ef', 'g', 'h'] },
      },
      short: {
        d: { alias: ['abc', 'd'] },
        g: { alias: ['ef', 'g', 'h'] },
        h: { alias: ['ef', 'g', 'h'] },
      },
      default: [
        { alias: ['abc', 'd'] },
        { alias: ['ef', 'g', 'h'] },
      ],
    });
  });

  it('Should set configs which has .demandOption as demand options',
  function() {
    var configs = {
      abc: { demandOption: true },
      de: { alias: 'f', demandOption: true },
      g: { alias: ['h', 'ij'], demandOption: true },
      k: {},
      lm: { alias: 'n' },
    };
    expect(parseConfigs(configs)).to.deep.equal({
      long: {
        abc: { alias: ['abc'], demandOption: true },
        de: { alias: ['de', 'f'], demandOption: true },
        f: { alias: ['de', 'f'], demandOption: true },
        g: { alias: ['g', 'h', 'ij'], demandOption: true },
        h: { alias: ['g', 'h', 'ij'], demandOption: true },
        ij: { alias: ['g', 'h', 'ij'], demandOption: true },
        k: { alias: ['k'] },
        lm: { alias: ['lm', 'n'] },
        n: { alias: ['lm', 'n'] },
      },
      short: {
        f: { alias: ['de', 'f'], demandOption: true },
        g: { alias: ['g', 'h', 'ij'], demandOption: true },
        h: { alias: ['g', 'h', 'ij'], demandOption: true },
        k: { alias: ['k'] },
        n: { alias: ['lm', 'n'] },
      },
      default: [
        { alias: ['abc'], demandOption: true },
        { alias: ['de', 'f'], demandOption: true },
        { alias: ['g', 'h', 'ij'], demandOption: true },
        { alias: ['k'] },
        { alias: ['lm', 'n'] },
      ],
    });
  });

  it('Should forbid duplicated aliaes', function() {
    var configs = {
      abc: { alias: 'f' },
      de: { alias: 'f' },
    };
    var err;
    try {
      parseConfigs(configs);
    } catch (e) {
      err = e;
    }
    expect(JSON.parse(err.message)).to.deep.equal({
      option: 'f',
      reason: 'duplicatedNameOrAlias',
    });
  });

  it('Should forbid duplicated option and alias', function() {
    var configs = {
      abc: { alias: ['f', 'de'] },
      de: {},
    };
    var err;
    try {
      parseConfigs(configs);
    } catch (e) {
      err = e;
    }
    expect(JSON.parse(err.message)).to.deep.equal({
      option: 'de',
      reason: 'duplicatedNameOrAlias',
    });
  });

  it('Should forbid duplicated camel case option names', function() {
    var configs = {
      'abc-de': {},
      'de': { alias: ['f', 'abc--de'] },
    };
    var err;
    try {
      parseConfigs(configs);
    } catch (e) {
      err = e;
    }
    expect(JSON.parse(err.message)).to.deep.equal({
      option: 'abcDe',
      reason: 'duplicatedNameOrAlias',
    });
  });

  it('Should forbid duplicated kebab case option names', function() {
    var configs = {
      'abc-de': {},
      'de': { alias: ['f', 'AbcDe'] },
    };
    var err;
    try {
      parseConfigs(configs);
    } catch (e) {
      err = e;
    }
    expect(JSON.parse(err.message)).to.deep.equal({
      option: 'abc-de',
      reason: 'duplicatedNameOrAlias',
    });
  });

});
