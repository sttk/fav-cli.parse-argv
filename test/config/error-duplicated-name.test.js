'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Duplicate name or alias', function() {

  it('Should cause an error if duplicating names of short option and alias',
  function() {
    var configs = {
      'ab-cd': { alias: 'a' },
      'a': { },
    };
    try {
      parse([], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('a');
      expect(e.reason).to.equal('duplicatedNameOrAlias');
    }
  });

  it('Should cause an error if duplicating names of long option and alias',
  function() {
    var configs = {
      'ab-cd': { alias: 'ef-gh' },
      'ef-gh': { },
    };
    try {
      parse([], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('ef-gh');
      expect(e.reason).to.equal('duplicatedNameOrAlias');
    }
  });

  it('Should cause an error if duplicating names of long option and alias' +
  '\n\tin camel case', function() {
    var configs = {
      'ab-cd': { alias: ['ef-gh'] },
      'ef--Gh': {},
    };
    try {
      parse([], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('ef--Gh');
      expect(e.reason).to.equal('duplicatedNameOrAlias');
    }
  });

  it('Should cause an error if duplicating names of long option and alias' +
  '\n\tin kebab case', function() {
    var configs = {
      'abCd': { alias: 'efGh' },
      'EfGh': {},
    };
    try {
      parse([], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('EfGh');
      expect(e.reason).to.equal('duplicatedNameOrAlias');
    }
  });

  it('Should cause an error if duplicating names of alias short names',
  function() {
    var configs = {
      'ab-cd': { alias: ['a'] },
      'ef-gh': { alias: ['a'] },
    };
    try {
      parse([], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('a');
      expect(e.reason).to.equal('duplicatedNameOrAlias');
    }
  });

  it('Should cause an error if duplicating names of alias long names',
  function() {
    var configs = {
      'ab-cd': { alias: ['ij-kl'] },
      'ef-gh': { alias: ['ij-kl'] },
    };
    try {
      parse([], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('ij-kl');
      expect(e.reason).to.equal('duplicatedNameOrAlias');
    }
  });

  it('Should cause an error if duplicating names of alias long names' +
  '\n\tin camel case', function() {
    var configs = {
      'ab-cd': { alias: ['ij-kl'] },
      'ef-gh': { alias: ['ijKl'] },
    };
    try {
      parse([], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('ijKl');
      expect(e.reason).to.equal('duplicatedNameOrAlias');
    }
  });

  it('Should cause an error if duplicating names of alias long names' +
  '\n\tin kebab case', function() {
    var configs = {
      'ab-cd': { alias: ['ijKl'] },
      'ef-gh': { alias: ['ij-kl'] },
    };
    try {
      parse([], configs);
      expect.fail();
    } catch (e) {
      expect(e.option).to.equal('ij-kl');
      expect(e.reason).to.equal('duplicatedNameOrAlias');
    }
  });
});
