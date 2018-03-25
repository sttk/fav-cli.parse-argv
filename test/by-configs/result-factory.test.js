'use strict';

var chai = require('chai');
var expect = chai.expect;
var path = require('path');

var factory = require('../../lib/parse-by-configs/result-factory');

describe('lib/parse-by-configs/result-factory', function() {

  describe('.getOptionValue', function() {
    it('Should get option value when config type is not an array', function() {
      ['boolean', 'number', 'string', 'count', '?'].forEach(function(type) {
        var config = { type: type };
        expect(factory.getOptionValue(config, 0, ['a']))
          .to.equal(undefined);
        expect(factory.getOptionValue(config, 0, ['a', 'b', 'c']))
          .to.equal('b');
        expect(factory.getOptionValue(config, 0, ['a', '123', 'c']))
          .to.equal('123');
        expect(factory.getOptionValue(config, 0, ['a', '-1.e+3', 'c']))
          .to.equal('-1.e+3');
        expect(factory.getOptionValue(config, 0, ['a', '-', 'c']))
          .to.equal('-');
        expect(factory.getOptionValue(config, 0, ['a', '-b', 'c']))
          .to.equal(undefined);
        expect(factory.getOptionValue(config, 0, ['a', '-bbb', 'c']))
          .to.equal(undefined);
        expect(factory.getOptionValue(config, 0, ['a', '--bc', 'c']))
          .to.equal(undefined);
        expect(factory.getOptionValue(config, 0, ['a', '--bc-de', 'c']))
          .to.equal(undefined);
        expect(factory.getOptionValue(config, 0, ['a', '--', '--bc-de', 'c']))
          .to.equal(undefined);
      });
    });

    it('Should get option value when config type is array', function() {
      var config = { type: 'array' };
      expect(factory.getOptionValue(config, 0, ['a']))
        .to.deep.equal([]);
      expect(factory.getOptionValue(config, 0, ['a', 'b']))
        .to.deep.equal(['b']);
      expect(factory.getOptionValue(config, 0, ['a', 'b', 'c']))
        .to.deep.equal(['b', 'c']);
      expect(factory.getOptionValue(config, 0, ['a', '', 'c']))
        .to.deep.equal(['', 'c']);
      expect(factory.getOptionValue(config, 0, ['a', '0', 'c']))
        .to.deep.equal([0, 'c']);
      expect(factory.getOptionValue(config, 0, ['a', '123', 'c']))
        .to.deep.equal([123, 'c']);
      expect(factory.getOptionValue(config, 0, ['a', '-2.e-2', 'c']))
        .to.deep.equal([-2.e-2, 'c']);
      expect(factory.getOptionValue(config, 0, ['a', '', 'c']))
        .to.deep.equal(['', 'c']);
      expect(factory.getOptionValue(config, 0, ['a', '-', 'c']))
        .to.deep.equal(['-', 'c']);
      expect(factory.getOptionValue(config, 0, ['a', '--', 'c']))
        .to.deep.equal([]);
      expect(factory.getOptionValue(config, 0, ['a', '-b', 'c']))
        .to.deep.equal([]);
      expect(factory.getOptionValue(config, 0, ['a', '--b', 'c']))
        .to.deep.equal([]);
      expect(factory.getOptionValue(config, 0, ['a', '--bb-dd', 'c']))
        .to.deep.equal([]);
    });
  });

  describe('.isValidConfig', function() {
    it('Should return false if config is nullish', function() {
      expect(factory.isValidConfig(undefined)).to.equal(false);
      expect(factory.isValidConfig(null)).to.equal(false);
    });

    it('Should return true if config.type is "boolean"', function() {
      var config = { type: 'boolean' };
      expect(factory.isValidConfig(config)).to.equal(true);
    });

    it('Should return true if config.type is "number"', function() {
      var config = { type: 'number' };
      expect(factory.isValidConfig(config)).to.equal(true);
    });

    it('Should return true if config.type is "string"', function() {
      var config = { type: 'string' };
      expect(factory.isValidConfig(config)).to.equal(true);
    });

    it('Should return true if config.type is "count"', function() {
      var config = { type: 'count' };
      expect(factory.isValidConfig(config)).to.equal(true);
    });

    it('Should return true if config.type is "array"', function() {
      var config = { type: 'array' };
      expect(factory.isValidConfig(config)).to.equal(true);
    });

    it('Should return true if config.type is others', function() {
      var config = { type: '' };
      expect(factory.isValidConfig(config)).to.equal(false);
      config.type = 'xxx';
      expect(factory.isValidConfig(config)).to.equal(false);
    });
  });

  describe('.configureValue.boolean', function() {
    it('Should return specified boolean', function() {
      var config = { type: 'boolean' };
      expect(factory.configureValue.boolean('abc', config, true))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, false))
        .to.equal(false);
    });

    it('Should return true if arg is not a boolean', function() {
      var config = { type: 'boolean' };
      expect(factory.configureValue.boolean('abc', config))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, ''))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, 'ABC'))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, 123))
        .to.equal(true);
    });

    it('Should do nothing even if config.requiresArg is true', function() {
      var config = { type: 'boolean', requiresArg: true };
      expect(factory.configureValue.boolean('abc', config))
        .to.equal(true);
    });

    it('Should do nothing even if config.choices is not null', function() {
      var config = { type: 'boolean', choices: false };
      expect(factory.configureValue.boolean('abc', config))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, true))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, ''))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, 'ABC'))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, 123))
        .to.equal(true);

      config.choices = true;
      expect(factory.configureValue.boolean('abc', config, false))
        .to.equal(false);
    });

    it('Should do nothing even if config.coerce is specified', function() {
      var config = { type: 'boolean', coerce: function(v) { return false; } };
      expect(factory.configureValue.boolean('abc', config))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, true))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, ''))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, 'ABC'))
        .to.equal(true);
      expect(factory.configureValue.boolean('abc', config, 123))
        .to.equal(true);

      config.coerce = function(v) { return true; };
      expect(factory.configureValue.boolean('abc', config, false))
        .to.equal(false);
    });
  });

  describe('.configureValue.number', function() {
    it('Should return a number', function() {
      var config = { type: 'number' };
      expect(factory.configureValue.number('abc', config))
        .to.be.NaN;
      expect(factory.configureValue.number('abc', config, ''))
        .to.be.NaN;
      expect(factory.configureValue.number('abc', config, '0'))
        .to.equal(0);
      expect(factory.configureValue.number('abc', config, '123'))
        .to.equal(123);
      expect(factory.configureValue.number('abc', config, '-1.23'))
        .to.equal(-1.23);
      expect(factory.configureValue.number('abc', config, 'AAA'))
        .to.be.NaN;
    });

    it('Should throw if config.requiresArg is true and value is nullish',
    function() {
      var config = { type: 'number', requiresArg: true };
      var err;
      try {
        factory.configureValue.number('abc', config);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'noRequiredArg',
      });

      expect(factory.configureValue.number('abc', config, ''))
        .to.be.NaN;
      expect(factory.configureValue.number('abc', config, '0'))
        .to.equal(0);
      expect(factory.configureValue.number('abc', config, '123'))
        .to.equal(123);
      expect(factory.configureValue.number('abc', config, '-1.23'))
        .to.equal(-1.23);
      expect(factory.configureValue.number('abc', config, 'AAA'))
        .to.be.NaN;
    });

    it('Should throw if config.choices is not null and value is not in ' +
    'choices', function() {
      var config = { type: 'number', choices: 111 };
      expect(factory.configureValue.number('abc', config, '111'))
        .to.equal(111);
      var err;
      try {
        factory.configureValue.number('abc', config, '123');
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: '123',
        choices: 111,
      });

      err = null;
      try {
        factory.configureValue.number('abc', config);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: 'undefined',
        choices: 111,
      });

      config.choices = [0, 123, -456];
      expect(factory.configureValue.number('abc', config, '00'))
        .to.equal(0);
      expect(factory.configureValue.number('abc', config, '123'))
        .to.equal(123);
      expect(factory.configureValue.number('abc', config, '-456'))
        .to.equal(-456);

      err = null;
      try {
        factory.configureValue.number('abc', config, '456');
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: '456',
        choices: [0, 123, -456],
      });

      err = null;
      try {
        factory.configureValue.number('abc', config);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: 'undefined',
        choices: [0, 123, -456],
      });
    });

    it('Should convert value with config.coerce', function() {
      var config = { type: 'number', coerce: function(v) {
        return v * 2;
      } };
      expect(factory.configureValue.number('abc', config, '111'))
        .to.equal(222);
      expect(factory.configureValue.number('abc', config, 'aaa'))
        .to.be.NaN;
      expect(factory.configureValue.number('abc', config))
        .to.be.NaN;
    });
  });

  describe('.configureValue.string', function() {
    it('Should return a string', function() {
      var config = { type: 'string' };
      expect(factory.configureValue.string('abc', config))
        .to.equal('');
      expect(factory.configureValue.string('abc', config, ''))
        .to.equal('');
      expect(factory.configureValue.string('abc', config, '0'))
        .to.equal('0');
      expect(factory.configureValue.string('abc', config, '123'))
        .to.equal('123');
      expect(factory.configureValue.string('abc', config, '-1.23'))
        .to.equal('-1.23');
      expect(factory.configureValue.string('abc', config, 'AAA'))
        .to.equal('AAA');
    });

    it('Should throw if config.requiresArg is true and value is nullish',
    function() {
      var config = { type: 'string', requiresArg: true };
      var err;
      try {
        factory.configureValue.string('abc', config);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'noRequiredArg',
      });

      expect(factory.configureValue.string('abc', config, ''))
        .to.equal('');
      expect(factory.configureValue.string('abc', config, '0'))
        .to.equal('0');
      expect(factory.configureValue.string('abc', config, '123'))
        .to.equal('123');
      expect(factory.configureValue.string('abc', config, '-1.23'))
        .to.equal('-1.23');
      expect(factory.configureValue.string('abc', config, 'AAA'))
        .to.equal('AAA');
    });

    it('Should throw if config.choices is not null and value is not in ' +
    'choices', function() {
      var config = { type: 'string', choices: 'AA' };
      expect(factory.configureValue.string('abc', config, 'AA'))
        .to.equal('AA');
      var err;
      try {
        factory.configureValue.string('abc', config, 'AB');
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: 'AB',
        choices: 'AA',
      });

      err = null;
      try {
        factory.configureValue.string('abc', config);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: 'undefined',
        choices: 'AA',
      });

      config.choices = ['A', 'BB', 'CCC'];
      expect(factory.configureValue.string('abc', config, 'A'))
        .to.equal('A');
      expect(factory.configureValue.string('abc', config, 'BB'))
        .to.equal('BB');
      expect(factory.configureValue.string('abc', config, 'CCC'))
        .to.equal('CCC');

      err = null;
      try {
        factory.configureValue.string('abc', config, 'DD');
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: 'DD',
        choices: ['A', 'BB', 'CCC'],
      });

      err = null;
      try {
        factory.configureValue.string('abc', config);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: 'undefined',
        choices: ['A', 'BB', 'CCC'],
      });

      config.choices = ['', 'a'];
      expect(factory.configureValue.string('abc', config))
        .to.equal('');
    });

    it('Should normalize values', function() {
      var config = { normalize: true };
      var result = factory.create();

      expect(factory.configureValue.string('abc', config, 'aaa/bbb/..'))
        .to.equal('aaa');
    });

    it('Should convert value with config.coerce', function() {
      var config = { type: 'string', coerce: function(v) {
        return String(v).toLowerCase();
      } };
      expect(factory.configureValue.string('abc', config, ''))
        .to.equal('');
      expect(factory.configureValue.string('abc', config, 'ABC'))
        .to.equal('abc');
      expect(factory.configureValue.string('abc', config))
        .to.equal('');

      config.normalize = true;
      config.coerce = function(v) {
        return v + '/..';
      };
      expect(factory.configureValue.string('abc', config, 'aaa/bbb/ccc/..'))
        .to.equal('aaa' + path.sep + 'bbb/..'); // normalize, then coerce
    });

  });

  describe('.configureValue.count', function() {
    it('Should return specified value', function() {
      var config = { type: 'count' };
      expect(factory.configureValue.count('abc', config, undefined))
        .to.equal(undefined);
      expect(factory.configureValue.count('abc', config, ''))
        .to.equal('');
      expect(factory.configureValue.count('abc', config, 'aaa'))
        .to.equal('aaa');
    });

    it('Should do nothing even if config.requiresArg is true', function() {
      var config = { type: 'count', requiresArg: true };
      expect(factory.configureValue.count('abc', config))
        .to.equal(undefined);
    });

    it('Should do nothing even if config.choices is not null', function() {
      var config = { type: 'count', choices: 'aaa' };
      expect(factory.configureValue.count('abc', config))
        .to.equal(undefined);
      expect(factory.configureValue.count('abc', config, true))
        .to.equal(true);
      expect(factory.configureValue.count('abc', config, ''))
        .to.equal('');
      expect(factory.configureValue.count('abc', config, 'ABC'))
        .to.equal('ABC');
      expect(factory.configureValue.count('abc', config, 123))
        .to.equal(123);
    });

    it('Should do nothing even if config.coerce is specified', function() {
      var config = { type: 'count', coerce: function(v) { return false; } };
      expect(factory.configureValue.count('abc', config))
        .to.equal(undefined);
      expect(factory.configureValue.count('abc', config, true))
        .to.equal(true);
      expect(factory.configureValue.count('abc', config, ''))
        .to.equal('');
      expect(factory.configureValue.count('abc', config, 'ABC'))
        .to.equal('ABC');
      expect(factory.configureValue.count('abc', config, 123))
        .to.equal(123);
    });
  });

  describe('.configureValue.array', function() {
    it('Should return an empty array when value is nullish', function() {
      var config = { type: 'array' };
      expect(factory.configureValue.array('abc', config))
        .to.deep.equal([]);
    });

    it('Should return an array which has an element when value is a string',
    function() {
      var config = { type: 'array' };
      expect(factory.configureValue.array('abc', config, ''))
        .to.deep.equal(['']);
      expect(factory.configureValue.array('abc', config, 'AAA'))
        .to.deep.equal(['AAA']);
      expect(factory.configureValue.array('abc', config, '123'))
        .to.deep.equal([123]);
      expect(factory.configureValue.array('abc', config, 123))
        .to.deep.equal([123]);
    });

    it('Should return an array when value is an array', function() {
      var config = { type: 'array' };
      expect(factory.configureValue.array('abc', config, []))
        .to.deep.equal([]);
      expect(factory.configureValue.array('abc', config, ['a']))
        .to.deep.equal(['a']);
      expect(factory.configureValue.array('abc', config, ['a', '123']))
        .to.deep.equal(['a', 123]);
      expect(factory.configureValue.array('abc', config, ['a', 123]))
        .to.deep.equal(['a', 123]);
    });

    it('Should throw if config.requiresArg is true and value is nullish',
    function() {
      var config = { type: 'array', requiresArg: true };
      var err;
      try {
        factory.configureValue.array('abc', config);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'noRequiredArg',
      });
      expect(factory.configureValue.array('abc', config, ''))
        .to.deep.equal(['']);
      expect(factory.configureValue.array('abc', config, 'AAA'))
        .to.deep.equal(['AAA']);
      expect(factory.configureValue.array('abc', config, '123'))
        .to.deep.equal([123]);
      expect(factory.configureValue.array('abc', config, 123))
        .to.deep.equal([123]);
    });

    it('Should throw if config.requiresArg is true and value is an empty ' +
    'array', function() {
      var config = { type: 'array', requiresArg: true };
      var err;
      try {
        factory.configureValue.array('abc', config, []);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'noRequiredArg',
      });
      expect(factory.configureValue.array('abc', config, ['a']))
        .to.deep.equal(['a']);
      expect(factory.configureValue.array('abc', config, ['a', '123']))
        .to.deep.equal(['a', 123]);
      expect(factory.configureValue.array('abc', config, ['a', 123]))
        .to.deep.equal(['a', 123]);
    });

    it('Should throw if config.choices is not null and value is not in ' +
    'choices', function() {
      var config = { type: 'array', choices: 'a' };
      var err;
      try {
        factory.configureValue.array('abc', config, ['b']);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: 'b',
        choices: 'a',
      });

      config = { type: 'array', choices: ['a', 'b'] };
      err = null;
      try {
        factory.configureValue.array('abc', config, ['b', 'c']);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: 'c',
        choices: ['a', 'b'],
      });

      config = { type: 'array', choices: [123, 456] };
      err = null;
      try {
        factory.configureValue.array('abc', config, ['-0.98e+2']);
      } catch (e) {
        err = JSON.parse(e.message);
      }
      expect(err).to.deep.equal({
        option: 'abc',
        reason: 'notInChoices',
        value: '-0.98e+2',
        choices: [123, 456],
      });

      expect(factory.configureValue.array('abc', config, []))
        .to.deep.equal([]);
    });

    it('Should convert value with config.coerce', function() {
      var config = { type: 'array', coerce: function(v) {
        if (typeof v === 'number') {
          return v * 2;
        } else {
          return String(v).toUpperCase();
        }
      } };
      expect(factory.configureValue.array('abc', config, [
        'abc', 123, 'def', -98,
      ])).to.deep.equal([
        'ABC', 246, 'DEF', -196,
      ]);

      expect(factory.configureValue.array('abc', config, []))
        .to.deep.equal([]);
    });
  });

  describe('.addTypedOption.boolean', function() {
    it('Should set specified boolean value to option values', function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.boolean(result, config, true))
        .to.equal(0);
      expect(result.options).to.deep.equal({
        a: true, bcDeFg: true, hi: true,
      });
      expect(factory.addTypedOption.boolean(result, config, false))
        .to.equal(0);
      expect(result.options).to.deep.equal({
        a: false, bcDeFg: false, hi: false,
      });
    });
  });

  describe('.addTypedOption.number', function() {
    it('Should set a number to option values if value is a number',
    function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.number(result, config, 0))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: 0, bcDeFg: 0, hi: 0,
      });
      expect(factory.addTypedOption.number(result, config, -123))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: -123, bcDeFg: -123, hi: -123,
      });
    });

    it('Should set specified value to option values (when converted by ' +
    '.coerce', function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.number(result, config, ''))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: '', bcDeFg: '', hi: '',
      });
      expect(factory.addTypedOption.number(result, config, 'a123'))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: 'a123', bcDeFg: 'a123', hi: 'a123',
      });
      expect(factory.addTypedOption.number(result, config, null))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: null, bcDeFg: null, hi: null,
      });
    });
  });

  describe('.addTypedOption.string', function() {
    it('Should set strings to option values', function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.string(result, config, ''))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: '', bcDeFg: '', hi: '',
      });
      expect(factory.addTypedOption.string(result, config, 'ABC'))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: 'ABC', bcDeFg: 'ABC', hi: 'ABC',
      });
      expect(factory.addTypedOption.string(result, config, '123'))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: '123', bcDeFg: '123', hi: '123',
      });
    });

    it('Should set specified values to option values (when converted by' +
    '.coerce)', function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.string(result, config, 123))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: 123, bcDeFg: 123, hi: 123,
      });
      expect(factory.addTypedOption.string(result, config, null))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: null, bcDeFg: null, hi: null,
      });
    });
  });

  describe('.addTypedOption.count', function() {
    it('Should set 1 to option values if first', function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.count(result, config)).to.equal(0);
      expect(result.options).to.deep.equal({ a: 1, bcDeFg: 1, hi: 1 });
    });

    it('Should count up to option values', function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.count(result, config)).to.equal(0);
      expect(result.options).to.deep.equal({ a: 1, bcDeFg: 1, hi: 1 });
      expect(factory.addTypedOption.count(result, config)).to.equal(0);
      expect(result.options).to.deep.equal({ a: 2, bcDeFg: 2, hi: 2 });
      expect(factory.addTypedOption.count(result, config)).to.equal(0);
      expect(result.options).to.deep.equal({ a: 3, bcDeFg: 3, hi: 3 });
    });

    it('Should set 2 to option values if the option is not a number',
    function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.count(result, config)).to.equal(0);
      expect(result.options).to.deep.equal({ a: 1, bcDeFg: 1, hi: 1 });
      expect(factory.addTypedOption.count(result, config)).to.equal(0);
      expect(result.options).to.deep.equal({ a: 2, bcDeFg: 2, hi: 2 });
      expect(factory.addTypedOption.count(result, config)).to.equal(0);
      expect(result.options).to.deep.equal({ a: 3, bcDeFg: 3, hi: 3 });

      result.options.a = true;
      expect(factory.addTypedOption.count(result, config)).to.equal(0);
      expect(result.options).to.deep.equal({ a: 2, bcDeFg: 2, hi: 2 });
    });
  });

  describe('.addTypedOption.array', function() {
    it('Should set an array to option values', function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.array(result, config, ['abc']))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: ['abc'], bcDeFg: ['abc'], hi: ['abc'] 
      });
    });

    it('Should add array value to arrays of option values', function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.array(result, config, ['abc', 'def']))
        .to.equal(2);
      expect(result.options).to.deep.equal({
        a: ['abc', 'def'], bcDeFg: ['abc', 'def'], hi: ['abc', 'def'] 
      });
      expect(factory.addTypedOption.array(result, config, ['gh', 'ij']))
        .to.equal(2);
      expect(result.options).to.deep.equal({
        a: ['abc', 'def', 'gh', 'ij'],
        bcDeFg: ['abc', 'def', 'gh', 'ij'],
        hi: ['abc', 'def', 'gh', 'ij'] 
      });
      expect(factory.addTypedOption.array(result, config, []))
        .to.equal(0);
      expect(result.options).to.deep.equal({
        a: ['abc', 'def', 'gh', 'ij'],
        bcDeFg: ['abc', 'def', 'gh', 'ij'],
        hi: ['abc', 'def', 'gh', 'ij'] 
      });
    });

    it('Should change option value to an array and add value if option value' +
    '\n\tis not an array', function() {
      var config = { alias: ['a', 'bcDeFg', 'hi'] };
      var result = factory.create();
      expect(factory.addTypedOption.array(result, config, ['abc']))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: ['abc'], bcDeFg: ['abc'], hi: ['abc'] 
      });
      expect(factory.addTypedOption.array(result, config, ['def']))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: ['abc', 'def'], bcDeFg: ['abc', 'def'], hi: ['abc', 'def'] 
      });

      result.options.a = 'AAA';
      expect(factory.addTypedOption.array(result, config, ['BBB']))
        .to.equal(1);
      expect(result.options).to.deep.equal({
        a: ['AAA', 'BBB'], bcDeFg: ['AAA', 'BBB'], hi: ['AAA', 'BBB'] 
      });
    });
  });
});
