'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Alias', function() {

  describe('Boolean option', function() {
    it('Should add alias options to result object', function() {
      var configs = {
        'ab-cd': { type: 'boolean', alias: 'a' },
        'ef-gh': { type: 'boolean', alias: ['ef', 'gh'] },
      };
      expect(parse(['--ab-cd', '--ef'], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': true,
          abCd: true,
          a: true,
          'ef-gh': true,
          efGh: true,
          ef: true,
          gh: true,
        },
      });
    });
  });

  describe('Number option', function() {
    it('Should add alias options to result object', function() {
      var configs = {
        'ab-cd': { type: 'number', alias: 'a' },
        'ef-gh': { type: 'number', alias: ['ef', 'gh'] },
      };
      expect(parse(['--ab-cd', '12', '--ef=34'], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': 12,
          abCd: 12,
          a: 12,
          'ef-gh': 34,
          efGh: 34,
          ef: 34,
          gh: 34,
        },
      });
    });
  });

  describe('String option', function() {
    it('Should add alias options to result object', function() {
      var configs = {
        'ab-cd': { type: 'string', alias: 'a' },
        'ef-gh': { type: 'string', alias: ['ef', 'gh'] },
      };
      expect(parse(['--ab-cd', '12', '--ef=34'], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': '12',
          abCd: '12',
          a: '12',
          'ef-gh': '34',
          efGh: '34',
          ef: '34',
          gh: '34',
        },
      });
    });
  });

  describe('Count option', function() {
    it('Should add alias options to result object', function() {
      var configs = {
        'ab-cd': { type: 'count', alias: 'a' },
        'ef-gh': { type: 'count', alias: ['ef', 'gh'] },
      };
      expect(parse(['--ab-cd', '-a', '--ef', '--efGh', '--ef-gh'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 2,
          abCd: 2,
          a: 2,
          'ef-gh': 3,
          efGh: 3,
          ef: 3,
          gh: 3,
        },
      });
    });
  });

  describe('No type option', function() {
    it('Should add short options by alias names', function() {
      var configs = {
        'a': { alias: 'ab-cd' },
        'e': { alias: ['ef-gh', 'eg'] },
        'i': { alias: ['ij-k'] },
      };
      expect(parse(['-a', 'AB', '-e=34', '-i'], configs)).to.deep.equal({
        args: [],
        options: {
          a: 'AB',
          'ab-cd': 'AB',
          abCd: 'AB',
          e: 34,
          'ef-gh': 34,
          efGh: 34,
          eg: 34,
          i: true,
          'ij-k': true,
          ijK: true,
        },
      });
    });

    it('Should add long options by alias names', function() {
      var configs = {
        'ab-cd': { alias: 'a' },
        'ef-gh': { alias: ['ef', 'gh'] },
        'ij-k': { alias: ['i', 'lmn'] },
      };
      expect(parse(['--ab-cd', 'AB', '--ef=34', '--ij-k'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 'AB',
          abCd: 'AB',
          a: 'AB',
          'ef-gh': 34,
          efGh: 34,
          ef: 34,
          gh: 34,
          'ij-k': true,
          ijK: true,
          lmn: true,
          i: true,
        },
      });
    });
  });
});
