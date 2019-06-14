'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

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
    '`~!@#$%^&*()_+=:;\'"<,>.?/'.split('').forEach(function(ch) {
      expect(parse(['-' + ch + 'A'])).to.deep.equals({
        options: { A: true },
        args: [],
      });
    });
  });

  it('Should set an empty string value when the opton is followed by an ' +
  '\n\tempty string', function() {
    expect(parse(['-a', ''])).to.deep.equal({
      options: { a: '' },
      args: [],
    });
  });

  it('Should set an array when the option is specified multiple times',
  function() {
    expect(parse(['-a', '-aa', 'ABC', '-a123', '-a=DEF'])).to.deep.equal({
      options: { a: [true, true, 'ABC', 123, 'DEF'] },
      args: [],
    });
  });

  it('Should parse "--x" as a short option', function() {
    expect(parse(['--a', '--b', 'ABC', '--a123', '--a=DEF'])).to.deep.equal({
      options: {
        a: [true, 'DEF'],
        b: 'ABC',
        a123: true,
      },
      args: [],
    });
  });
});
