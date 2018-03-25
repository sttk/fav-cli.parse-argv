'use strict';

var chai = require('chai');
var expect = chai.expect;

var factory = require('../../lib/result-factory');

describe('lib/result-factory', function() {

  describe('.create', function() {
    it('Should create a result object', function() {
      expect(factory.create()).to.deep.equal({
        options: {},
        args: [],
      });
    });
  });

  describe('.isIgnoredCharacter', function() {
    it('Should return true if arg is a control code', function() {
      '\0\t\b\n\r'.split('').forEach(function(c) {
        expect(factory.isIgnoredCharacter(c)).to.equal(true);
      });
    });

    it('Should return true if arg is a mark', function() {
      '~`!@#$%^&*()-_+={[]}|\\:;"\'<,>.?/'.split('').forEach(function(c) {
        expect(factory.isIgnoredCharacter(c)).to.equal(true);
      });
    });

    it('Should return true if arg is a number', function() {
      '1234567890'.split('').forEach(function(c) {
        expect(factory.isIgnoredCharacter(c)).to.equal(true);
      });
    });

    it('Should return false if arg is neither control code, mark, nor number',
    function() {
      expect(factory.isIgnoredCharacter('a')).to.equal(false);
      expect(factory.isIgnoredCharacter('A')).to.equal(false);
      expect(factory.isIgnoredCharacter('あ')).to.equal(false);
    });
  });

  describe('.toOptionValue', function() {
    it('Should return a number if arg is a numeric string', function() {
      expect(factory.toOptionValue('0')).to.equal(0);
      expect(factory.toOptionValue('123')).to.equal(123);
      expect(factory.toOptionValue('-987')).to.equal(-987);
    });

    it('Should return a string if arg does not start with "-"', function() {
      expect(factory.toOptionValue('')).to.equal('');
      expect(factory.toOptionValue('ABC')).to.equal('ABC');
    });

    it('Should return "-" if arg is "-"', function() {
      expect(factory.toOptionValue('-')).to.equal('-');
    });

    it('Should return undefined if arg is "--"', function() {
      expect(factory.toOptionValue('--')).to.equal(undefined);
    });

    it('Should return undefined if arg is undefined', function() {
      expect(factory.toOptionValue(undefined)).to.equal(undefined);
    });

    it('Should return null if arg is null', function() {
      expect(factory.toOptionValue(null)).to.equal(null);
    });

    it('Should return undefined otherwise', function() {
      expect(factory.toOptionValue('-a')).to.equal(undefined);
      expect(factory.toOptionValue('--A')).to.equal(undefined);
      expect(factory.toOptionValue('-aaa')).to.equal(undefined);
      expect(factory.toOptionValue('--AAA')).to.equal(undefined);
      expect(factory.toOptionValue('-abcd')).to.equal(undefined);
      expect(factory.toOptionValue('--AB-CD')).to.equal(undefined);
    });
  });

  describe('.addNormalArg', function() {
    it('Should add a normal argument', function() {
      var result = factory.create();
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      factory.addNormalArg(result, 'abc');
      expect(result).to.deep.equal({
        options: {},
        args: ['abc'],
      });

      factory.addNormalArg(result, 123);
      expect(result).to.deep.equal({
        options: {},
        args: ['abc', 123],
      });
    });
  });

  describe('.addAllArgsAfterNotFlag', function() {
    it('Should add normal args after specified index', function() {
      var result = factory.create();
      var args = ['abc', 'def', 'ghi'];
      factory.addAllArgsAfterNotFlag(result, args, 0);
      expect(result).to.deep.equal({
        options: {},
        args: ['def', 'ghi'],
      });

      result = factory.create();
      args = ['abc', 'def', 'ghi'];
      factory.addAllArgsAfterNotFlag(result, args, 1);
      expect(result).to.deep.equal({
        options: {},
        args: ['ghi'],
      });

      result = factory.create();
      args = ['abc', 'def', 'ghi'];
      factory.addAllArgsAfterNotFlag(result, args, 2);
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      result = factory.create();
      args = ['abc', 'def', 'ghi'];
      factory.addAllArgsAfterNotFlag(result, args, 3);
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });
    });

    it('Should convert an argument to a number if possible', function() {
      var result = factory.create();
      var args = [
        '--', '123', '-456', '-7.', '-.8', '-1e+2', '.2e-2',
      ];
      factory.addAllArgsAfterNotFlag(result, args, 0);
      expect(result).to.deep.equal({
        options: {},
        args: [123, -456, -7, -0.8, -100, 0.002,],
      });
    });

    it('Should not convert perticular arguments to numbers even if possible' +
    '\n\twith Number(v), parseInt(v) or parseFloat(v)', function() {
      var result = factory.create();
      var args = ['--', '', ' ', ' 123 ', '12 34'];
      factory.addAllArgsAfterNotFlag(result, args, 0);
      expect(result).to.deep.equal({
        options: {},
        args: ['', ' ', ' 123 ', '12 34'],
      });
    });
  });

  describe('.addOption', function() {
    it('Should add a boolean option', function() {
      var result = factory.create();
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      factory.addOption(result, 'abc', true);
      expect(result).to.deep.equal({
        options: { abc: true },
        args: [],
      });

      factory.addOption(result, 'def', false);
      expect(result).to.deep.equal({
        options: { abc: true, def: false },
        args: [],
      });
    });

    it('Should add a number option', function() {
      var result = factory.create();
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      factory.addOption(result, 'abc', 123);
      expect(result).to.deep.equal({
        options: { abc: 123 },
        args: [],
      });

      factory.addOption(result, 'def', -456);
      expect(result).to.deep.equal({
        options: { abc: 123, def: -456 },
        args: [],
      });
    });

    it('Should add a string option', function() {
      var result = factory.create();
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      factory.addOption(result, 'abc', 'ABC');
      expect(result).to.deep.equal({
        options: { abc: 'ABC' },
        args: [],
      });

      factory.addOption(result, 'def', 'a123');
      expect(result).to.deep.equal({
        options: { abc: 'ABC', def: 'a123' },
        args: [],
      });
    });

    it('Should convert a string option to a number if possible', function() {
      var result = factory.create();
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      factory.addOption(result, 'abc', '123');
      expect(result).to.deep.equal({
        options: { abc: 123 },
        args: [],
      });

      factory.addOption(result, 'def', '-456');
      expect(result).to.deep.equal({
        options: { abc: 123, def: -456 },
        args: [],
      });

      factory.addOption(result, 'ghi', '-7.');
      expect(result).to.deep.equal({
        options: { abc: 123, def: -456, ghi: -7 },
        args: [],
      });

      factory.addOption(result, 'j', '-.8');
      expect(result).to.deep.equal({
        options: { abc: 123, def: -456, ghi: -7, j: -0.8 },
        args: [],
      });

      factory.addOption(result, 'k', '1e+2');
      expect(result).to.deep.equal({
        options: { abc: 123, def: -456, ghi: -7, j: -0.8, k: 100 },
        args: [],
      });

      factory.addOption(result, 'l', '-.2e-2');
      expect(result).to.deep.equal({
        options: { abc: 123, def: -456, ghi: -7, j: -0.8, k: 100, l: -0.002 },
        args: [],
      });
    });

    it('Should not convert perticular options to numbers even if possible',
    function() {
      var result = factory.create();
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      factory.addOption(result, 'a', '');
      expect(result).to.deep.equal({
        options: { a: '' },
        args: [],
      });

      factory.addOption(result, 'b', ' ');
      expect(result).to.deep.equal({
        options: { a: '', b: ' ' },
        args: [],
      });

      factory.addOption(result, 'c', ' 123 ');
      expect(result).to.deep.equal({
        options: { a: '', b: ' ', c: ' 123 ' },
        args: [],
      });

      factory.addOption(result, 'd', '12 34');
      expect(result).to.deep.equal({
        options: { a: '', b: ' ', c: ' 123 ', d: '12 34' },
        args: [],
      });
    });

    it('Should store same options into an array', function() {
      var result = factory.create();
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      factory.addOption(result, 'a', 'A1');
      expect(result).to.deep.equal({
        options: { a: 'A1' },
        args: [],
      });

      factory.addOption(result, 'a', 'A2');
      expect(result).to.deep.equal({
        options: { a: ['A1', 'A2'] },
        args: [],
      });

      factory.addOption(result, 'a', 'A3');
      expect(result).to.deep.equal({
        options: { a: ['A1', 'A2', 'A3'] },
        args: [],
      });
    });

    it('Should ignore options of which name are empty', function() {
      var result = factory.create();
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      factory.addOption(result, '', 'ABC');
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });
    });
  });

  describe('.addOriginalAndCamelCaseOption', function() {
    it('Should add an option in both original case and camel case',
    function() {
      var result = factory.create();
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      factory.addOriginalAndCamelCaseOption(result, 'abc-def-ghi', true);
      expect(result).to.deep.equal({
        options: {
          'abc-def-ghi': true,
          abcDefGhi: true,
        },
        args: [],
      });
    });

    it('Should not add an option in camel case if original name is same' +
    '\n\twith camel case name', function() {
      var result = factory.create();
      expect(result).to.deep.equal({
        options: {},
        args: [],
      });

      factory.addOriginalAndCamelCaseOption(result, 'abcDefGhi', true);
      expect(result).to.deep.equal({
        options: {
          abcDefGhi: true,
        },
        args: [],
      });

      factory.addOriginalAndCamelCaseOption(result, 'abc', 123);
      expect(result).to.deep.equal({
        options: {
          abcDefGhi: true,
          abc: 123,
        },
        args: [],
      });

      factory.addOriginalAndCamelCaseOption(result, 'Def', 789);
      expect(result).to.deep.equal({
        options: {
          abcDefGhi: true,
          abc: 123,
          Def: 789,
        },
        args: [],
      });
    });
  });
});
