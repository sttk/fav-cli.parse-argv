'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Demand option', function() {

  it('Should cause an error if demanded option is not specified',
  function() {
    var configs = {
      'ab-cd': { alias: 'a' },
      'ef-gh': { alias: ['ef', 'gh'] },
      'ij-k': { alias: ['i', 'lmn'], demandOption: true },
    };
    try {
      parse([], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('ij-k');
      expect(e.reason).to.equal('noDemandedOption');
    }
  });

  it('Should not cause an error if all demanded option is specified',
  function() {
    var configs = {
      a: { alias: 'A', demandOption: true },
      'bb-cc': { alias: ['B', 'C'], demandOption: true },
      'DD_EE': { demandOption: true }
    };
    expect(parse(['-ABC', '--ddEe'], configs)).to.deep.equals({
      args: [],
      options: {
        A: true,
        a: true,
        B: true,
        'bb-cc': true,
        bbCc: true,
        C: true,
        'dd-ee': true,
        'ddEe': true,
        DD_EE: true,
      },
    });
  });
});
