'use strict';

var chai = require('chai');
var expect = chai.expect;

var parse = require('..');

describe('Parse by configs', function() {

  describe('About normal arguments', function() {
    it('Should parse argv which has only normal arguments', function() {
      var configs = {
        fooBar: {},
        baz: {}
      };
      expect(parse(['abc', 'def', 'ghi'], configs))
      .to.deep.equal({
        options: {
          fooBar: undefined,
          'foo-bar': undefined,
          baz: undefined,
        },
        args: ['abc', 'def', 'ghi'],
      });
    });

    it('Should parse an empty argv', function() {
      var configs = {
        fooBar: {},
        baz: {}
      };
      expect(parse([], configs)).to.deep.equal({
        options: {
          fooBar: undefined,
          'foo-bar': undefined,
          baz: undefined,
        },
        args: [],
      });
    });

    it('Should parse argv which has number arguments', function() {
      var configs = {
        fooBar: {},
        baz: {}
      };
      expect(parse(['123', '-123', '.1', '-.1', '.', '-.'], configs))
      .to.deep.equal({
        options: {
          fooBar: undefined,
          'foo-bar': undefined,
          baz: undefined,
        },  // Marks are ignored as options
        args: [123, -123, 0.1, -0.1, '.'],
      });
    });

    it('Should deal with \'-\' as a normal arg', function() {
      var configs = {
        fooBar: {},
        baz: {}
      };
      expect(parse(['-', 'def'], configs)).to.deep.equal({
        options: {
          fooBar: undefined,
          'foo-bar': undefined,
          baz: undefined,
        },
        args: ['-', 'def'],
      });
      expect(parse(['abc', '-', 'def'], configs)).to.deep.equal({
        options: {
          fooBar: undefined,
          'foo-bar': undefined,
          baz: undefined,
        },
        args: ['abc', '-', 'def'],
      });
      expect(parse(['abc', '-'], configs)).to.deep.equal({
        options: {
          fooBar: undefined,
          'foo-bar': undefined,
          baz: undefined,
        },
        args: ['abc', '-'],
      });
    });

    it('Should deal with all args after \'--\' as a normal arg', function() {
      var configs = {
        fooBar: {},
        baz: {}
      };
      expect(parse(['-a', '--', '-b'], configs)).to.deep.equal({
        options: {
          a: true,
          fooBar: undefined,
          'foo-bar': undefined,
          baz: undefined,
        },
        args: ['-b'],
      });
    });
  });

  describe('About options which are defined in configs', function() {
    describe('Short option', function() {
      it('Should parse boolean options', function() {
        var configs = {
          fooBar: { type: 'boolean', alias: ['f', 'fb'] },
          a: { type: 'boolean' },
          b: { type: 'boolean', alias: 'baz' },
          c: { type: 'boolean' },
          d: { type: 'boolean' },
          e: { type: 'boolean' },
        };
        expect(parse(['-f', 'ABC', '-ac123', '-ad=ABC', '-ab'], configs))
        .to.deep.equal({
          options: {
            'foo-bar': true,
            fooBar: true,
            f: true,
            fb: true,
            baz: true,
            b: true,
            a: true,
            c: true,
            d: true,
            e: false,
          },
          args: ['ABC'],
        });
      });

      it('Should parse number options', function() {
        var configs = {
          fooBar: { type: 'number', alias: ['f', 'fb'] },
          a: { type: 'number' },
          b: { type: 'number', alias: 'baz' },
          c: { type: 'number' },
          d: { type: 'number' },
          e: { type: 'number' },
        };
        expect(parse(['-f', '111', '-ac123', '-ad=99', '-ab'], configs))
        .to.deep.equal({
          options: {
            'foo-bar': 111,
            fooBar: 111,
            f: 111,
            fb: 111,
            baz: NaN,
            b: NaN,
            a: NaN,
            c: 123,
            d: 99,
            e: 0,
          },
          args: [],
        });
      });

      it('Should parse string options', function() {
        var configs = {
          fooBar: { type: 'string', alias: ['f', 'fb'] },
          a: { type: 'string' },
          b: { type: 'string', alias: 'baz' },
          c: { type: 'string' },
          d: { type: 'string' },
          e: { type: 'string' },
        };
        expect(parse(['-f', 'ABC', '-ac123', '-ad=XX', '-ab'], configs))
        .to.deep.equal({
          options: {
            'foo-bar': 'ABC',
            fooBar: 'ABC',
            f: 'ABC',
            fb: 'ABC',
            baz: '',
            b: '',
            a: '',
            c: '123',
            d: 'XX',
            e: '',
          },
          args: [],
        });
      });

      it('Should parse count options', function() {
        var configs = {
          fooBar: { type: 'count', alias: ['f', 'fb'] },
          a: { type: 'count' },
          b: { type: 'count', alias: 'baz' },
          c: { type: 'count' },
          d: { type: 'count' },
          e: { type: 'count' },
        };
        expect(parse(['-f', 'ABC', '-ac123', '-ad=XX', '-ab'], configs))
        .to.deep.equal({
          options: {
            'foo-bar': 1,
            fooBar: 1,
            f: 1,
            fb: 1,
            baz: 1,
            b: 1,
            a: 3,
            c: 1,
            d: 1,
            e: 0,
          },
          args: ['ABC'],
        });
      });

      it('Should parse array options', function() {
        var configs = {
          fooBar: { type: 'array', alias: ['f', 'fb'] },
          a: { type: 'array' },
          b: { type: 'array', alias: 'baz' },
          c: { type: 'array' },
          d: { type: 'array' },
          e: { type: 'array' },
        };
        expect(parse(['-f', 'ABC', 'DEF', '-ac123', '-ad=XX', '-ab'], configs))
        .to.deep.equal({
          options: {
            'foo-bar': ['ABC', 'DEF'],
            fooBar: ['ABC', 'DEF'],
            f: ['ABC', 'DEF'],
            fb: ['ABC', 'DEF'],
            baz: [],
            b: [],
            a: [],
            c: [123],
            d: ['XX'],
            e: [],
          },
          args: [],
        });
      });
    });

    describe('Long option', function() {
      it('Should parse boolean options', function() {
        var configs = {
          fooBar: { type: 'boolean', alias: ['f', 'fb'] },
          b: { type: 'boolean', alias: ['baz', 'qu-ux'] },
          'cor-ge': { type: 'boolean' },
        };
        expect(parse([
          '--foo-bar', 'ABC', '--baz', '--no-cor-ge', 'DEF', '--grault'
        ], configs)).to.deep.equal({
          options: {
            'foo-bar': true,
            fooBar: true,
            f: true,
            fb: true,
            baz: true,
            b: true,
            'qu-ux': true,
            quUx: true,
            'cor-ge': false,
            corGe: false,
            grault: true,
          },
          args: ['ABC', 'DEF'],
        });
      });

      it('Should parse number options', function() {
        var configs = {
          fooBar: { type: 'number', alias: ['f', 'fb'] },
          b: { type: 'number', alias: 'baz' },
          'cor-ge': { type: 'number' },
          d: { type: 'number' },
        };
        expect(parse([
          '--foo-bar', '111', '--fb', '222', '--baz=123', '--d111',
        ], configs)).to.deep.equal({
          options: {
            'foo-bar': 222,
            fooBar: 222,
            f: 222,
            fb: 222,
            baz: 123,
            b: 123,
            'cor-ge': 0,
            corGe: 0,
            d: 0,
            d111: true,
          },
          args: [],
        });
      });

      it('Should parse string options', function() {
        var configs = {
          fooBar: { type: 'string', alias: ['f', 'fb'] },
          b: { type: 'string', alias: 'baz' },
          'cor-ge': { type: 'string' },
          d: { type: 'string' },
        };
        expect(parse([
          '--foo-bar', 'ABC', '--fb', '222', '--baz=123', '--d111', '--cor-ge',
          'CCC',
        ], configs)).to.deep.equal({
          options: {
            'foo-bar': '222',
            fooBar: '222',
            f: '222',
            fb: '222',
            baz: '123',
            b: '123',
            d111: true,
            'cor-ge': 'CCC',
            corGe: 'CCC',
            d: '',
          },
          args: [],
        });
      });

      it('Should parse count options', function() {
        var configs = {
          fooBar: { type: 'count', alias: ['f', 'fb'] },
          a: { type: 'count' },
          b: { type: 'count', alias: 'baz' },
          'cor-ge': { type: 'count', alias: 'c' },
          d: { type: 'count' },
        };
        expect(parse([
          '--foo-bar', 'ABC', '--fb', '--cor-ge=123'
        ], configs)).to.deep.equal({
          options: {
            'foo-bar': 2,
            fooBar: 2,
            f: 2,
            fb: 2,
            a: 0,
            b: 0,
            baz: 0,
            'cor-ge': 1,
            corGe: 1,
            c: 1,
            d: 0,
          },
          args: ['ABC'],
        });
      });

      it('Should parse array options', function() {
        var configs = {
          fooBar: { type: 'array', alias: ['f', 'fb'] },
          a: { type: 'array' },
          b: { type: 'array', alias: 'baz' },
          'cor-ge': { type: 'array', alias: 'c' },
          d: { type: 'array' },
        };
        expect(parse([
          '--foo-bar', 'ABC', 'DEF', '--fb', '--cor-ge=123',
        ], configs)).to.deep.equal({
          options: {
            'foo-bar': ['ABC', 'DEF'],
            fooBar: ['ABC', 'DEF'],
            f: ['ABC', 'DEF'],
            fb: ['ABC', 'DEF'],
            a: [],
            b: [],
            baz: [],
            'cor-ge': [123],
            corGe: [123],
            c: [123],
            d: [],
          },
          args: [],
        });
      });
    });
  });

});
