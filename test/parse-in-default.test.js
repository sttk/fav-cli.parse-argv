'use strict';

var chai = require('chai');
var expect = chai.expect;

var parse = require('..');

describe('Parse in default', function() {
  it('Should parse argv which has only normal arguments', function() {
    expect(parse(['abc', 'def', 'ghi'])).to.deep.equal({
      options: {},
      args: ['abc', 'def', 'ghi'],
    });
  });

  it('Should parse an empty argv', function() {
    expect(parse([])).to.deep.equal({
      options: {},
      args: [],
    });
  });

  it('Should parse argv which has number arguments', function() {
    expect(parse(['123', '-123', '.1', '-.1', '.', '-.'])).to.deep.equal({
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

  describe('Short option', function() {
    it('Should parse short options of which value are booleans', function() {
      expect(parse(['-a', '-b', '-c'])).to.deep.equal({
        options: { a: true, b: true, c: true },
        args: [],
      });
    });

    it('Should parse short options of which value are numbers', function() {
      expect(parse([
        '-a', '123', '-b', '-123', '-c', '0', '-d', '010', '-e', '0x11'
      ])).to.deep.equal({
        options: { a: 123, b: -123, c: 0, d: 10, e: 17 },
        args: [],
      });
    });

    it('Should parse short options of which value are strings', function() {
      expect(parse([
        '-a', 'ABC', '-b', '-.', '@#$%',
      ])).to.deep.equal({
        options: { a: 'ABC', b: true },
        args: ['@#$%'],
      });
    });

    it('Should parse short options containing \'=\'', function() {
      expect(parse([
        '-a=ABC', '-bc=d=BCD', '-efg=.#$', '-hi.=HI'
      ])).to.deep.equal({
        options: {
          a: 'ABC', b: true, c: 'd=BCD', e: true, f: true, g: '.#$',
          h: true, i: true, H: true, I: true,
        },
        args: [],
      });
    });

    it('Should parse argv which has short options followed by a number',
    function() {
      expect(parse([
        '-a123', '-bcd4.56', '-ef9g87'
      ])).to.deep.equal({
        options: {
          a: 123, b: true, c: true, d: 4.56, e: true, f: true, g: 87,
        },
        args: [],
      });
    });

    it('Should ignore control codes, marks, numbers as options', function() {
      expect(parse([
        '-~!@#$%^&*()-_+=:;\'"<,>.?/A'
      ])).to.deep.equal({
        options: { A: true },
        args: [],
      });
    });
  });

  describe('not flag', function() {
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

  describe('long options', function() {
    it('Should parse long options of which value are boolean', function() {
      expect(parse([
        '--help', '--v', '--verbose', '--silent',
        '--~!@#$%^&*()-_+[{]}|\\:;\'"<>,.?/',
      ])).to.deep.equal({
        options: {
          help: true, v: true, verbose: true, silent: true,
          '~!@#$%^&*()-_+[{]}|\\:;\'"<>,.?/': true,
        },
        args: [],
      });
    });

    it('Should parse long options of which value are number', function() {
      expect(parse([
        '--a', '1234', '--bcd', '5.56', '--f-g-h', 0,
        '--~!@#$%^&*()-_+[{]}|\\:;\'"<>,.?/', 999,
      ])).to.deep.equal({
        options: {
          a: 1234, bcd: 5.56, 'f-g-h': 0,
          '~!@#$%^&*()-_+[{]}|\\:;\'"<>,.?/': 999,
          'fGH': 0,
        },
        args: [],
      });
    });

    it('Should parse long options of which value are string', function() {
      expect(parse([
        '--a', 'A12', '--bcd', 'BCD', '--f-g-h', 'F+G+H',
        '--~!@#$%^&*()-_+[{]}|\\:;\'"<>,.?/',
        '~!@#$%^&*()-_+[{]}|\\:;\'"<>,.?/',
      ])).to.deep.equal({
        options: {
          a: 'A12', bcd: 'BCD', 'f-g-h': 'F+G+H',
          '~!@#$%^&*()-_+[{]}|\\:;\'"<>,.?/':
            '~!@#$%^&*()-_+[{]}|\\:;\'"<>,.?/',
          fGH: 'F+G+H',
        },
        args: [],
      });
    });

    it('Should parse long options containing \'=\'', function() {
      expect(parse([
        '--a=A12', '--bcd=123', '--f-g-h=F+G+H',
        '--~!@#$%^&*()-_+=[{]}|\\:;\'"<>,.?/',
      ])).to.deep.equal({
        options: {
          a: 'A12', bcd: 123, 'f-g-h': 'F+G+H',
          '~!@#$%^&*()-_+': '[{]}|\\:;\'"<>,.?/',
          fGH: 'F+G+H',
        },
        args: [],
      });
    });

    it('Should add both original and camel-case long options', function() {
      expect(parse([
        '--abc-def', 'ABCDEF', '--ghi-jkl=123'
      ])).to.deep.equal({
        options: {
          'abc-def': 'ABCDEF',
          abcDef: 'ABCDEF',
          'ghi-jkl': 123,
          ghiJkl: 123,
        },
        args: [],
      });
    });

    it('Should deal with `--no-xxx` option as false flag', function() {
      expect(parse([
        '--no-abc-def', 'ABCDEF', '--no-ghi-jkl=123'
      ])).to.deep.equal({
        options: {
          'abc-def': false,
          abcDef: false,
          'no-ghi-jkl': 123,
          noGhiJkl: 123,
        },
        args: ['ABCDEF'],
      });
    });
  });

  describe('options specified multiple times', function() {
    it('Should have values in array if same option are specified multi-times',
    function() {
      expect(parse([
        '-ab', '123', '--cde', 'A', '-abc99', '--cde=EEE'
      ])).to.deep.equal({
        options: {
          a: [true, true], b: [123, true], c: 99,
          cde: ['A', 'EEE'],
        },
        args: [],
      });
    });
  });

});
