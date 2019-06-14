'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

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

  it('Should add both original and kebab-case long options', function() {
    expect(parse([
      '--abcDef', 'ABCDEF', '--ghiJkl=123'
    ])).to.deep.equal({
      options: {
        'abc-def': 'ABCDEF',
        abcDef: 'ABCDEF',
        'ghi-jkl': 123,
        ghiJkl: 123,
      },
      args: [],
    });

    expect(parse([
      '--AbcDef', 'ABCDEF', '--GhiJkl=123'
    ])).to.deep.equal({
      options: {
        'abc-def': 'ABCDEF',
        AbcDef: 'ABCDEF',
        'ghi-jkl': 123,
        GhiJkl: 123,
      },
      args: [],
    });
  });

  it('Should deal with `--no-xxx` option as false flag', function() {
    expect(parse([
      '--no-abc-def', 'ABCDEF',
    ])).to.deep.equal({
      options: {
        'abc-def': false,
        abcDef: false,
      },
      args: ['ABCDEF'],
    });
  });

  it('Should deal with `--no-xxx` option as false flag even if option ' +
  '\n\tincludes "="', function() {
    expect(parse([
      '--no-ghi-jkl=123'
    ])).to.deep.equal({
      options: {
        'ghi-jkl': false,
        ghiJkl: false,
      },
      args: [],
    });
  });

  it('Should set an array when the option is specified multiple times',
  function() {
    expect(parse([
      '--ab-cd', '--ab-cd', 'A', '--ab-cd', '123', '--ab-cd=B',
    ])).to.deep.equal({
      options: {
        'ab-cd': [true, 'A', 123, 'B'],
        abCd: [true, 'A', 123, 'B'],
      },
      args: [],
    });
  });

});
