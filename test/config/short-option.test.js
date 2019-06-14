'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Short options', function() {

  describe('Boolean option', function() {

    it('Should parse boolean options', function() {
      var configs = {
        a: { type: 'boolean' },
        b: { type: 'boolean' },
      };
      expect(parse(['-ab'], configs)).to.deep.equal({
        args: [],
        options: { a: true, b: true },
      });
    });

    it('Should not use next arg even if it is non-option', function() {
      var configs = {
        a: { type: 'boolean' },
        b: { type: 'boolean' },
      };
      expect(parse(['-ab', 'A'], configs)).to.deep.equal({
        args: ['A'],
        options: { a: true, b: true },
      });
    });

    it('Should not use following string even if it is a number', function() {
      var configs = {
        a: { type: 'boolean' },
        b: { type: 'boolean' },
      };
      expect(parse(['-a1234'], configs)).to.deep.equal({
        args: [],
        options: { a: true },
      });
    });

    it('Should use following string if it is not a number', function() {
      var configs = {
        a: { type: 'boolean' },
        b: { type: 'boolean' },
      };
      expect(parse(['-a12Cb34'], configs)).to.deep.equal({
        args: [],
        options: { a: true, b: true, C: true },
      });
    });

    it('Should not use following string even if it starts with "="',
    function() {
      var configs = {
        a: { type: 'boolean' },
        b: { type: 'boolean' },
      };
      expect(parse(['-a=123', '-b=AB2'], configs)).to.deep.equal({
        args: [],
        options: { a: true, b: true },
      });
    });

  });

  describe('Number option', function() {

    it('Should parse number options', function() {
      var configs = {
        a: { type: 'number' },
        b: { type: 'number' },
        c: { type: 'number' },
      };
      expect(parse(['-a', '123', '-bc', '456'], configs)).to.deep.equal({
        args: [],
        options: { a: 123, b: NaN, c: 456 },
      });
    });

    it('Should set NaN if there is no next arg', function() {
      var configs = {
        a: { type: 'number' },
        b: { type: 'number' },
        c: { type: 'number' },
      };
      expect(parse(['-a', '-bc'], configs)).to.deep.equal({
        args: [],
        options: { a: NaN, b: NaN, c: NaN },
      });
    });

    it('Should set NaN if next arg cannot convert to a number', function() {
      var configs = {
        a: { type: 'number' },
        b: { type: 'number' },
        c: { type: 'number' },
      };
      expect(parse(['-a', 'A', '-bc', 'B'], configs)).to.deep.equal({
        args: [],
        options: { a: NaN, b: NaN, c: NaN },
      });
    });

    it('Should set a value if following string can convert a number',
    function() {
      var configs = {
        a: { type: 'number' },
        b: { type: 'number' },
        c: { type: 'number' },
      };
      expect(parse(['-a123', 'A', '-bc456'], configs)).to.deep.equal({
        args: ['A'],
        options: { a: 123, b: NaN, c: 456 },
      });
    });

    it('Should set NaN if following string cannot convert a number',
    function() {
      var configs = {
        a: { type: 'number' },
        b: { type: 'number' },
        c: { type: 'number' },
        d: { type: 'number' },
      };
      expect(parse(['-a1b2', '-c3d4'], configs)).to.deep.equal({
        args: [],
        options: { a: NaN, b: 2, c: NaN, d: 4 },
      });
    });

    it('Should use following string as short options if following string' +
    '\n\tcannot convert a number', function() {
      var configs = {
        a: { type: 'number' },
        b: { type: 'number' },
        c: { type: 'number' },
      };
      expect(parse(['-a123A', '-bc45B6'], configs)).to.deep.equal({
        args: [],
        options: { a: NaN, b: NaN, c: NaN, A: true, B: 6 },
      });
    });

    it('Should set a value if following string starts with "=" and can' +
    '\n\tconvert a number', function() {
      var configs = {
        a: { type: 'number' },
        b: { type: 'number' },
        c: { type: 'number' },
      };
      expect(parse(['-a=-123', '-bc=4.5'], configs)).to.deep.equal({
        args: [],
        options: { a: -123, b: NaN, c: 4.5 },
      });
    });

    it('Should not set a value if following string starts with "=" but ' +
    '\n\tcannot convert a number', function() {
      var configs = {
        a: { type: 'number' },
        b: { type: 'number' },
        c: { type: 'number' },
      };
      expect(parse(['-a=A', '-bc=12B34'], configs)).to.deep.equal({
        args: [],
        options: { a: NaN, b: NaN, c: NaN },
      });
    });
  });

  describe('String options', function() {

    it('Should parse string options', function() {
      var configs = {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      };
      expect(parse(['-a', 'ABC', '-bc', '456'], configs)).to.deep.equal({
        args: [],
        options: { a: 'ABC', b: '', c: '456' },
      });
    });

    it('Should set an empty string if there is no next arg', function() {
      var configs = {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      };
      expect(parse(['-a', '-bc'], configs)).to.deep.equal({
        args: [],
        options: { a: '', b: '', c: '' },
      });
    });

    it('Should set a value if next arg is not an option', function() {
      var configs = {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      };
      expect(parse(['-a', '456', '-bc', 'ABC'], configs)).to.deep.equal({
        args: [],
        options: { a: '456', b: '', c: 'ABC' },
      });
    });

    it('Should set an empty string if next arg is an option', function() {
      var configs = {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      };
      expect(parse(['-a', '-D', '-bc', '-E'], configs)).to.deep.equal({
        args: [],
        options: { a: '', b: '', c: '', D: true, E: true },
      });
    });

    it('Should set a value if following string can convert to a number',
    function() {
      var configs = {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      };
      expect(parse(['-a123', '-bc45'], configs)).to.deep.equal({
        args: [],
        options: { a: '123', b: '', c: '45' },
      });
    });

    it('Should set an empty string if following string cannot convert to ' +
    '\n\ta number', function() {
      var configs = {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      };
      expect(parse(['-a1D3', '-bc4E'], configs)).to.deep.equal({
        args: [],
        options: { a: '', b: '', c: '', D: 3, E: true },
      });
    });

    it('Should use following string as a value if it starts with "="',
    function() {
      var configs = {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      };
      expect(parse(['-a=1D3', '-bc=4E'], configs)).to.deep.equal({
        args: [],
        options: { a: '1D3', b: '', c: '4E' },
      });
    });
  });

  describe('Count options', function() {

    it('Should parse count options', function() {
      var configs = {
        a: { type: 'count' },
        b: { type: 'count' },
        c: { type: 'count' },
      };
      expect(parse(['-a', '-bc'], configs)).to.deep.equal({
        args: [],
        options: { a: 1, b: 1, c: 1 },
      });
    });

    it('Should count up if an option specified multiple times', function() {
      var configs = {
        a: { type: 'count' },
        b: { type: 'count' },
        c: { type: 'count' },
      };
      expect(parse(['-a', '-abc', '-ab', '-c'], configs)).to.deep.equal({
        args: [],
        options: { a: 3, b: 2, c: 2 },
      });
    });

    it('Should not use next arg even if it can be converted to a number',
    function() {
      var configs = {
        a: { type: 'count' },
        b: { type: 'count' },
        c: { type: 'count' },
      };
      expect(parse(['-a=12', '-abc=345'], configs)).to.deep.equal({
        args: [],
        options: { a: 2, b: 1, c: 1 },
      });
    });

  });

});
