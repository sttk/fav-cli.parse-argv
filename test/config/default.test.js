'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Default', function() {

  describe('Boolean option', function() {
    it('Should set default value if not specified', function() {
      var configs = {
        a: { type: 'boolean', default: true },
        'b-c': { type: 'boolean', alias: 'b', default: false },
      };
      expect(parse([], configs)).to.deep.equals({
        args: [],
        options: { a: true, 'b-c': false, bC: false, b: false },
      });
    });
  });

  describe('Number option', function() {
    it('Should set default value if not specified', function() {
      var configs = {
        a: { type: 'number', default: 99 },
        'b-c': { type: 'boolean', alias: 'b', default: -88 },
      };
      expect(parse([], configs)).to.deep.equals({
        args: [],
        options: { a: 99, 'b-c': -88, bC: -88, b: -88 },
      });
    });
  });

  describe('String option', function() {
    it('Should set default value if not specified', function() {
      var configs = {
        a: { type: 'string', default: 'ABC' },
        'b-c': { type: 'boolean', alias: 'b', default: -88 },
      };
      expect(parse([], configs)).to.deep.equals({
        args: [],
        options: { a: 'ABC', 'b-c': -88, bC: -88, b: -88 },
      });
    });
  });

  describe('Count option', function() {
    it('Should set default value if not specified', function() {
      var configs = {
        a: { type: 'count', default: 'ABC' },
        'b-c': { type: 'boolean', alias: 'b', default: -88 },
      };
      expect(parse([], configs)).to.deep.equals({
        args: [],
        options: { a: 'ABC', 'b-c': -88, bC: -88, b: -88 },
      });
    });
  });

  describe('No type option', function() {
    it('Should set default value if not specified', function() {
      var configs = {
        a: { default: 'ABC' },
        'b-c': { type: 'boolean', alias: 'b', default: '-88' },
        c: { default: -10 },
      };
      expect(parse([], configs)).to.deep.equals({
        args: [],
        options: { a: 'ABC', 'b-c': '-88', bC: '-88', b: '-88', c: -10 },
      });
    });
  });

  describe('Array option', function() {
    it('Should set default value if not specified', function() {
      var configs = {
        a: { array: true, default: 'ABC' },
        'b-c': { type: 'boolean', alias: 'b', default: [1, 2] },
        c: { array: true, default: -10 },
      };
      expect(parse([], configs)).to.deep.equals({
        args: [],
        options: { a: 'ABC', 'b-c': [1, 2], bC: [1, 2], b: [1, 2], c: -10 },
      });
    });
  });
});
