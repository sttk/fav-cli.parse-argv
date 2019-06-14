'use strict';

var chai = require('chai');
var expect = chai.expect;
var parse = require('../..');

describe('Long options', function() {

  describe('Boolean option', function() {

    it('Should parse boolean options', function() {
      var configs = {
        'ab-cd': { type: 'boolean' },
        'ef-gh': { type: 'boolean' },
      };
      expect(parse(['--ab-cd', '--ef-gh'], configs)).to.deep.equal({
        args: [],
        options: {
          'ab-cd': true,
          'abCd': true,
          'ef-gh': true,
          'efGh': true,
        },
      });
    });

    it('Should not use next arg even if it is non-option', function() {
      var configs = {
        'ab-cd': { type: 'boolean' },
        'ef-gh': { type: 'boolean' },
      };
      expect(parse(['--ab-cd', '123', '--ef-gh', 'ABC'], configs))
      .to.deep.equal({
        args: [123, 'ABC'],
        options: {
          'ab-cd': true,
          'abCd': true,
          'ef-gh': true,
          'efGh': true,
        },
      });
    });

    it('Should not have value even if option including "="', function() {
      var configs = {
        'ab-cd': { type: 'boolean' },
        'ef-gh': { type: 'boolean' },
      };
      expect(parse(['--ab-cd=123', '--ef-gh=ABC'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': true,
          'abCd': true,
          'ef-gh': true,
          'efGh': true,
        },
      });
    });
  });

  describe('Number option', function() {

    it('Should parse number options', function() {
      var configs = {
        'ab-cd': { type: 'number' },
        'ef-gh': { type: 'number' },
      };
      expect(parse(['--ab-cd', '12', '--ef-gh', '34'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 12,
          abCd: 12,
          'ef-gh': 34,
          efGh: 34,
        },
      });
    });

    it('Should set NaN if there is no next arg', function() {
      var configs = {
        'ab-cd': { type: 'number' },
        'ef-gh': { type: 'number' },
      };
      expect(parse(['--ab-cd', '--ef-gh'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': NaN,
          abCd: NaN,
          'ef-gh': NaN,
          efGh: NaN,
        },
      });
    });

    it('Should set NaN if next arg cannot convert to a number', function() {
      var configs = {
        'ab-cd': { type: 'number' },
        'ef-gh': { type: 'number' },
      };
      expect(parse(['--ab-cd', 'AB', '--ef-gh', 'CD'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': NaN,
          abCd: NaN,
          'ef-gh': NaN,
          efGh: NaN,
        },
      });
    });

    it('Should set a value if option includes "="', function() {
      var configs = {
        'ab-cd': { type: 'number' },
        'ef-gh': { type: 'number' },
      };
      expect(parse(['--ab-cd=12', '--ef-gh=-3.4'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 12,
          abCd: 12,
          'ef-gh': -3.4,
          efGh: -3.4,
        },
      });
    });

    it('Should set NaN if following string starts with "=" but ' +
    '\n\tcannot convert a number', function() {
      var configs = {
        'ab-cd': { type: 'number' },
        'ef-gh': { type: 'number' },
      };
      expect(parse(['--ab-cd=1A', '--ef-gh=B4'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': NaN,
          abCd: NaN,
          'ef-gh': NaN,
          efGh: NaN,
        },
      });
    });
  });

  describe('String option', function() {

    it('Should parse string options', function() {
      var configs = {
        'ab-cd': { type: 'string' },
        'ef-gh': { type: 'string' },
      };
      expect(parse(['--ab-cd', 'AB', '--ef-gh', 'CD'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 'AB',
          abCd: 'AB',
          'ef-gh': 'CD',
          efGh: 'CD',
        },
      });
    });

    it('Should set an empty string if there is no next arg', function() {
      var configs = {
        'ab-cd': { type: 'string' },
        'ef-gh': { type: 'string' },
      };
      expect(parse(['--ab-cd', '--ef-gh'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': '',
          abCd: '',
          'ef-gh': '',
          efGh: '',
        },
      });
    });

    it('Should set a string value even if next arg can be converted to a ' +
    '\n\tnumber', function() {
      var configs = {
        'ab-cd': { type: 'string' },
        'ef-gh': { type: 'string' },
      };
      expect(parse(['--ab-cd', '12', '--ef-gh', '34'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': '12',
          abCd: '12',
          'ef-gh': '34',
          efGh: '34',
        },
      });
    });

    it('Should set an empty string if next arg is an option', function() {
      var configs = {
        'ab-cd': { type: 'string' },
        'ef-gh': { type: 'string' },
      };
      expect(parse(['--ab-cd', '-a', '--ef-gh', '-b'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': '',
          abCd: '',
          'ef-gh': '',
          efGh: '',
          a: true,
          b: true,
        },
      });
    });

    it('Should use following string as a value if an option includes "="',
    function() {
      var configs = {
        'ab-cd': { type: 'string' },
        'ef-gh': { type: 'string' },
      };
      expect(parse(['--ab-cd=AB', '--ef-gh=12'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 'AB',
          abCd: 'AB',
          'ef-gh': '12',
          efGh: '12',
        },
      });
    });
  });

  describe('Count option', function() {

    it('Should parse count options', function() {
      var configs = {
        'ab-cd': { type: 'count' },
        'ef-gh': { type: 'count' },
      };
      expect(parse(['--ab-cd', '--ef-gh'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 1,
          abCd: 1,
          'ef-gh': 1,
          efGh: 1,
        },
      });
    });

    it('Should count up if specifying same options multiple times ',
    function() {
      var configs = {
        'ab-cd': { type: 'count' },
        'ef-gh': { type: 'count' },
      };
      expect(parse(['--ab-cd', '--ef-gh', '--ab-cd', '--ef-gh'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 2,
          abCd: 2,
          'ef-gh': 2,
          efGh: 2,
        },
      });
    });

    it('Should not use next arg even if next arg can be converted to a ' +
    '\n\tnumber', function() {
      var configs = {
        'ab-cd': { type: 'count' },
        'ef-gh': { type: 'count' },
      };
      expect(parse(['--ab-cd', '12', '--ef-gh', '34'], configs))
      .to.deep.equal({
        args: [12, 34],
        options: {
          'ab-cd': 1,
          abCd: 1,
          'ef-gh': 1,
          efGh: 1,
        },
      });
    });

    it('Should not use following string after "="', function() {
      var configs = {
        'ab-cd': { type: 'count' },
        'ef-gh': { type: 'count' },
      };
      expect(parse(['--ab-cd=12', '--ef-gh=AA'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 1,
          abCd: 1,
          'ef-gh': 1,
          efGh: 1,
        },
      });
    });

    it('Should count up if the same option in camel case or kebab case is ' +
    '\n\tspecified',
    function() {
      var configs = {
        'ab-cd': { type: 'count' },
      };
      expect(parse(['--ab-cd', '--abCd', '--AB-cd', '--AbCd'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 4,
          abCd: 4,
        },
      });
    });

    it('Should not count up if the defferent option in camel case is' +
    '\n\tspecified',
    function() {
      var configs = {
        'ab-cd': { type: 'count' },
      };
      expect(parse(['--ab-cd', '--ABCD', '--aBcD', '--a-bc-d'], configs))
      .to.deep.equal({
        args: [],
        options: {
          'ab-cd': 1,
          abCd: 1,
          ABCD: true,
          aBcD: [true, true],
          'a-bc-d': [true, true],
        },
      });
    });
  });

  describe('"--no-*" option', function() {

    describe('Boolean option', function() {

      it('Should set false', function() {
        var configs = {
          'ab-cd': { type: 'boolean' },
        };
        expect(parse(['--no-ab-cd'], configs)).to.deep.equal({
          args: [],
          options: {
            'ab-cd': false,
            abCd: false,
          },
        });
      });

      it('Should not use next arg', function() {
        var configs = {
          'ab-cd': { type: 'boolean' },
          'ef-gh': { type: 'boolean' },
        };
        expect(parse(['--no-ab-cd', '--no-ef-gh'], configs)).to.deep.equal({
          args: [],
          options: {
            'ab-cd': false,
            abCd: false,
            'ef-gh': false,
            efGh: false,
          },
        });
      });

      it('Should not use following string after "="', function() {
        var configs = {
          'ab-cd': { type: 'boolean' },
          'ef-gh': { type: 'boolean' },
        };
        expect(parse(['--no-ab-cd=12', '--no-ef-gh=AB'], configs))
        .to.deep.equal({
          args: [],
          options: {
            'ab-cd': false,
            abCd: false,
            'ef-gh': false,
            efGh: false,
          },
        });
      });
    });

    describe('Number option', function() {

      it('Should set NaN', function() {
        var configs = {
          'ab-cd': { type: 'number' },
        };
        expect(parse(['--no-ab-cd'], configs)).to.deep.equal({
          args: [],
          options: {
            'ab-cd': NaN,
            abCd: NaN,
          },
        });
      });

      it('Should not use next arg', function() {
        var configs = {
          'ab-cd': { type: 'number' },
          'ef-gh': { type: 'number' },
        };
        expect(parse(['--no-ab-cd', '--no-ef-gh'], configs)).to.deep.equal({
          args: [],
          options: {
            'ab-cd': NaN,
            abCd: NaN,
            'ef-gh': NaN,
            efGh: NaN,
          },
        });
      });

      it('Should not use following string after "="', function() {
        var configs = {
          'ab-cd': { type: 'number' },
          'ef-gh': { type: 'number' },
        };
        expect(parse(['--no-ab-cd=12', '--no-ef-gh=AB'], configs))
        .to.deep.equal({
          args: [],
          options: {
            'ab-cd': NaN,
            abCd: NaN,
            'ef-gh': NaN,
            efGh: NaN,
          },
        });
      });
    });

    describe('String option', function() {

      it('Should set an empty string', function() {
        var configs = {
          'ab-cd': { type: 'string' },
        };
        expect(parse(['--no-ab-cd'], configs)).to.deep.equal({
          args: [],
          options: {
            'ab-cd': '',
            abCd: '',
          },
        });
      });

      it('Should not use next arg', function() {
        var configs = {
          'ab-cd': { type: 'string' },
          'ef-gh': { type: 'string' },
        };
        expect(parse(['--no-ab-cd', '--no-ef-gh'], configs)).to.deep.equal({
          args: [],
          options: {
            'ab-cd': '',
            abCd: '',
            'ef-gh': '',
            efGh: '',
          },
        });
      });

      it('Should not use following string after "="', function() {
        var configs = {
          'ab-cd': { type: 'string' },
          'ef-gh': { type: 'string' },
        };
        expect(parse(['--no-ab-cd=12', '--no-ef-gh=AB'], configs))
        .to.deep.equal({
          args: [],
          options: {
            'ab-cd': '',
            abCd: '',
            'ef-gh': '',
            efGh: '',
          },
        });
      });
    });

    describe('Count option', function() {
      it('Should set an empty string', function() {
        var configs = {
          'ab-cd': { type: 'count' },
        };
        expect(parse(['--no-ab-cd'], configs)).to.deep.equal({
          args: [],
          options: {
            'ab-cd': -1,
            abCd: -1,
          },
        });
      });

      it('Should not use next arg', function() {
        var configs = {
          'ab-cd': { type: 'count' },
          'ef-gh': { type: 'count' },
        };
        expect(parse(['--no-ab-cd', 'A', '--no-ef-gh', 'B'], configs))
        .to.deep.equal({
          args: ['A', 'B'],
          options: {
            'ab-cd': -1,
            abCd: -1,
            'ef-gh': -1,
            efGh: -1,
          },
        });
      });

      it('Should not use following string after "="', function() {
        var configs = {
          'ab-cd': { type: 'count' },
          'ef-gh': { type: 'count' },
        };
        expect(parse(['--no-ab-cd=12', '--no-ef-gh=AB'], configs))
        .to.deep.equal({
          args: [],
          options: {
            'ab-cd': -1,
            abCd: -1,
            'ef-gh': -1,
            efGh: -1,
          },
        });
      });

      it('Should decrement', function() {
        var configs = {
          'ab-cd': { type: 'count' },
        };
        expect(parse(['--ab-cd', '--ab-cd', '--no-ab-cd'], configs))
        .to.deep.equal({
          args: [],
          options: {
            'ab-cd': 1,
            abCd: 1,
          },
        });
      });
    });
  });
});
