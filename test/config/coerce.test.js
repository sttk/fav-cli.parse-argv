'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Coerce', function() {

  it('Should coerce value', function() {
    function coerce(value, config, option) {
      expect(value).to.equal(123);
      expect(config).to.deep.equal({
        alias: ['ab-cd', 'abCd', 'a'],
        coerce: coerce,
      });
      expect(option).to.equal('a');
      return value * 2;
    }
    var configs = {
      'ab-cd': { alias: 'a', coerce: coerce },
    };
    expect(parse(['-a', '123'], configs)).to.deep.equal({
      args: [],
      options: {
        'ab-cd': 246,
        abCd: 246,
        a: 246,
      },
    });
  });

  it('Should coerce value before choices', function() {
    var configs = {
      'ab-cd': { alias: 'a', coerce: coerce, choices: [1, 2] },
    };
    function coerce(value) {
      return value * 2;
    }

    expect(parse(['-a', '1'], configs)).to.deep.equal({
      args: [],
      options: {
        'ab-cd': 2,
        abCd: 2,
        a: 2,
      },
    });

    try {
      parse(['-a', '2'], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('a');
      expect(e.reason).to.equal('noInChoices');
      expect(e.choices).to.deep.equal([1, 2]);
    }

    expect(parse(['-a', '0.5'], configs)).to.deep.equal({
      args: [],
      options: {
        'ab-cd': 1,
        abCd: 1,
        a: 1,
      },
    });
  });

  it('Should coerce value after requiresArg\'s check', function() {
    var configs = {
      'ab-cd': { alias: 'a', coerce1: coerce, requiresArg: true },
    };
    function coerce() {
      expect.fail();
      return 1;
    }

    try {
      parse(['-a'], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('a');
      expect(e.reason).to.equal('noRequiredArg');
    }
  });

  it('Should pass count value to coerce function even if actual option value' +
  '\n\tis converted to other value', function() {
    var cnt = 0;
    var configs = {
      'ab-cd': { type: 'count', alias: 'a', coerce: coerce },
    };
    function coerce(v) {
      cnt++;
      expect(v).to.equal(cnt);
      return 'ABC' + v;
    }
    expect(parse(['--ab-cd', '--a', '-aaa'], configs)).to.deep.equals({
      args: [],
      options: {
        'ab-cd': 'ABC5',
        abCd: 'ABC5',
        a: 'ABC5',
      },
    });
  });
});
