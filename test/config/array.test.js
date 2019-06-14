'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Array', function() {

  describe('Boolean option', function() {
    it('Should set value as a boolean array', function() {
      var configs = {
        'ab-cd': { type: 'boolean', array: true },
      };
      expect(parse([
        '--ab-cd',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': [true],
          'abCd': [true],
        },
      });
    });

    it('Should set multiple values to an array', function() {
      var configs = {
        'ab-cd': { type: 'boolean', array: true },
      };
      expect(parse([
        '--ab-cd', '--ab-cd', '--abCd', '--AbCd',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': [true, true, true, true],
          'abCd': [true, true, true, true],
        },
      });
    });

    it('Should add values even "--no-*"', function() {
      var configs = {
        'ab-cd': { type: 'boolean', array: true },
      };
      expect(parse([
        '--ab-cd', '--no-ab-cd', '--ab-cd',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': [true, false, true],
          'abCd': [true, false, true],
        },
      });
    });
  });

  describe('Number option', function() {
    it('Should set value as a number array', function() {
      var configs = {
        'ab-cd': { type: 'number', array: true },
      };
      expect(parse([
        '--ab-cd', '123',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': [123],
          'abCd': [123],
        },
      });
    });

    it('Should set multiple values to an array', function() {
      var configs = {
        'ab-cd': { type: 'number', array: true },
      };
      expect(parse([
        '--ab-cd', '--ab-cd', '123', '--ab-cd', 'ABC',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': [NaN, 123, NaN],
          'abCd': [NaN, 123, NaN],
        },
      });
    });

    it('Should add values even an option includes "="', function() {
      var configs = {
        'ab-cd': { type: 'number', array: true },
      };
      expect(parse([
        '--ab-cd=123', '--ab-cd=ABC', '--ab-cd=456',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': [123, NaN, 456],
          'abCd': [123, NaN, 456],
        },
      });
    });

    it('Should add values even "--no-*"', function() {
      var configs = {
        'ab-cd': { type: 'number', array: true },
      };
      expect(parse([
        '--no-ab-cd=123', '--no-ab-cd', '456',
      ], configs)).to.deep.equal({
        args: [456],
        options: {
          'ab-cd': [NaN, NaN],
          'abCd': [NaN, NaN],
        },
      });
    });
  });

  describe('String option', function() {
    it('Should set value as a string array', function() {
      var configs = {
        'ab-cd': { type: 'string', array: true },
      };
      expect(parse([
        '--ab-cd', 'ABC',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': ['ABC'],
          'abCd': ['ABC'],
        },
      });
    });

    it('Should set multiple values to an array', function() {
      var configs = {
        'ab-cd': { type: 'string', array: true },
      };
      expect(parse([
        '--ab-cd', 'ABC', '--ab-cd', '123', '--abCd',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': ['ABC', '123', ''],
          'abCd': ['ABC', '123', ''],
        },
      });
    });

    it('Should add values even an option includes "="', function() {
      var configs = {
        'ab-cd': { type: 'string', array: true },
      };
      expect(parse([
        '--ab-cd=ABC', '--ab-cd=123', '--ab-cd=',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': ['ABC', '123', ''],
          'abCd': ['ABC', '123', ''],
        },
      });
    });

    it('Should add values even "--no-*"', function() {
      var configs = {
        'ab-cd': { type: 'string', array: true },
      };
      expect(parse([
        '--no-ab-cd', 'ABC', '--no-ab-cd=EFG',
      ], configs)).to.deep.equal({
        args: ['ABC'],
        options: {
          'ab-cd': ['', ''],
          'abCd': ['', ''],
        },
      });
    });
  });

  describe('Count option', function() {
    it('Should ignore array option', function() {
      var configs = {
        'ab-cd': { type: 'count', array: true },
      };
      expect(parse([
        '--ab-cd',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': 1,
          'abCd': 1,
        },
      });
    });

    it('Should count multiple same options', function() {
      var configs = {
        'ab-cd': { type: 'count', array: true },
      };
      expect(parse([
        '--ab-cd', '--ab-cd', '--abCd', '--no-ab-cd',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': 2,
          'abCd': 2,
        },
      });
    });
  });

  describe('No type option', function() {
    it('Should set value as a array', function() {
      var configs = {
        'ab-cd': { array: true },
      };
      expect(parse([
        '--ab-cd', '--ab-cd', 'ABC', '--ab-cd=EFG'
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': [true, 'ABC', 'EFG'],
          'abCd': [true, 'ABC', 'EFG'],
        },
      });
    });

    it('Should convert a value to a number if possible', function() {
      var configs = {
        'ab-cd': { array: true },
      };
      expect(parse([
        '--ab-cd', '123', '--ab-cd=456',
      ], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': [123, 456],
          'abCd': [123, 456],
        },
      });
    });

    it('Should add values even "--no-*"', function() {
      var configs = {
        'ab-cd': { array: true },
      };
      expect(parse([
        '--no-ab-cd', '123', '--no-ab-cd=456',
      ], configs)).to.deep.equal({
        args: [123],
        options: {
          'ab-cd': [false, false],
          'abCd': [false, false],
        },
      });
    });
  });
});
