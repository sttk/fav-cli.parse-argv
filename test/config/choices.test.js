'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Choices', function() {

  describe('Boolean option', function() {
    it('Should ignore choice option', function() {
      var configs = {
        a: { type: 'boolean', choices: false },
        'b-c': { type: 'boolean', alias: 'b', choices: [false] },
        cc: { type: 'boolean', choices: true },
        d: { type: 'boolean', choices: true },
      };
      expect(parse(['-a', '--b-c', '--no-cc'], configs)).to.deep.equals({
        args: [],
        options: { a: true, 'b-c': true, bC: true, b: true, cc: false },
      });
    });
  });

  describe('Number option', function() {
    it('Should set a value if the value is in choices', function() {
      var configs = {
        'ab-cd': { type: 'number', alias: 'a', choices: [1, 2, 3] },
      };
      expect(parse(['-a', '2'], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': 2,
          abCd: 2,
          a: 2,
        },
      });
    });

    it('Should cause an error if the specified value is not in choices',
    function() {
      var configs = {
        'ab-cd': { type: 'number', alias: 'a', choices: [1, 2, 3] },
      };
      try {
        parse(['-a', '4'], configs);
        expect.fail();
      } catch (e) {
        expect(e.option).to.equal('a');
        expect(e.reason).to.equal('noInChoices');
      }
    });

    it('Should support single choice option', function() {
      var configs = {
        'ab-cd': { type: 'number', alias: 'a', choices: 2 },
      };
      expect(parse(['-a', '2'], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': 2,
          abCd: 2,
          a: 2,
        },
      });
    });
  });

  describe('String option', function() {
    it('Should set a value if the value is in choices', function() {
      var configs = {
        'ab-cd': { type: 'string', alias: 'a', choices: ['A', 'B', 'C'] },
      };
      expect(parse(['-a', 'B'], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': 'B',
          abCd: 'B',
          a: 'B',
        },
      });
    });

    it('Should cause an error if the specified value is not in choices',
    function() {
      var configs = {
        'ab-cd': { type: 'string', alias: 'a', choices: ['A', 'B', 'C'] },
      };
      try {
        parse(['-a', 'D'], configs);
        expect.fail();
      } catch (e) {
        expect(e.option).to.equal('a');
        expect(e.reason).to.equal('noInChoices');
      }
    });

    it('Should cause an error if the specified value is not in choices',
    function() {
      var configs = {
        'ab-cd': { type: 'string', alias: 'a', choices: 'C' },
      };
      try {
        parse(['-a', 'D'], configs);
        expect.fail();
      } catch (e) {
        expect(e.option).to.equal('a');
        expect(e.reason).to.equal('noInChoices');
      }
    });
  });

  describe('Count option', function() {
    it('Should ignore choice option', function() {
      var configs = {
        a: { type: 'count', choices: [1, 2] },
      };
      expect(parse(['-a'], configs)).to.deep.equals({
        args: [],
        options: { a: 1 },
      });
      expect(parse(['-aa'], configs)).to.deep.equals({
        args: [],
        options: { a: 2 },
      });
      expect(parse(['-aaa'], configs)).to.deep.equals({
        args: [],
        options: { a: 3 },
      });
    });
  });

  describe('No type option', function() {
    it('Should set a value if the value is in choices', function() {
      var configs = {
        'ab-cd': { alias: 'a', choices: ['A', 123, true] },
      };
      expect(parse(['-a', '123'], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': 123,
          abCd: 123,
          a: 123,
        },
      });
    });

    it('Should cause an error if the specified value is not in choices',
    function() {
      var configs = {
        'ab-cd': { alias: 'a', choices: ['A', 123, true] },
      };
      try {
        parse(['-a', '456'], configs);
        expect.fail();
      } catch (e) {
        expect(e.option).to.equal('a');
        expect(e.reason).to.equal('noInChoices');
      }
    });
  });
});
