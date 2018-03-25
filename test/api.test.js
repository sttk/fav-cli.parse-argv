'use strict';

var chai = require('chai');
var expect = chai.expect;
var exec = require('child_process').exec;

var path = require('path');
var fixturesDir = path.resolve(__dirname, 'fixtures');

describe('API', function() {
  describe('.parseArgv()', function() {
    it('Should use process.argv when no argument', function(done) {
      exec(['node', path.join(fixturesDir, 'test-api-0.js'),
        'foo', '-aB123', '--cde-fgh', 'ijk'
      ].join(' '), cb);
      function cb(err, stdout, stderr) {
        expect(err).to.equal(null);
        expect(stderr).to.equal('');
        expect(JSON.parse(stdout)).to.deep.equal({
          options: {
            a: true,
            B: 123,
            'cde-fgh': 'ijk',
            'cdeFgh': 'ijk',
          },
          args: ['foo'],
        });
        done();
      }
    });
  });

  describe('.parseArg(argv)', function() {
    it('Should use 1st argument as cli args when 1st arg is an array',
    function(done) {
      exec(['node', path.join(fixturesDir, 'test-api-1.js')].join(' '), cb);
      function cb(err, stdout, stderr) {
        expect(err).to.equal(null);
        expect(stderr).to.equal('');
        expect(JSON.parse(stdout)).to.deep.equal({
          options: {
            a: true,
            B: 123,
            'cde-fgh': 'ijk',
            'cdeFgh': 'ijk',
          },
          args: ['foo'],
        });
        done();
      }
    });
  });

  describe('.parseArg(configs)', function() {
    it('Should use 1st argument as configs when 1st arg is not an array',
    function(done) {
      exec(['node', path.join(fixturesDir, 'test-api-2.js'),
        'foo', '-aB123', '--cde-fgh', 'ijk'
      ].join(' '), cb);
      function cb(err, stdout, stderr) {
        expect(err).to.equal(null);
        expect(stderr).to.equal('');
        expect(JSON.parse(stdout)).to.deep.equal({
          options: {
            bar: true,
            a: true,
            B: 123,
            'cde-fgh': ['ijk'],
            cdeFgh: ['ijk'],
            c: ['ijk'],
            lmnOpq: 0,
            'lmn-opq': 0,
          },
          args: ['foo'],
        });
        done();
      }
    });
  });

  describe('.parseArg(argv, configs)', function() {
    it('Should use 1st argument as argv and 2nd argument as configs',
    function(done) {
      exec(['node', path.join(fixturesDir, 'test-api-3.js')].join(' '), cb);
      function cb(err, stdout, stderr) {
        expect(err).to.equal(null);
        expect(stderr).to.equal('');
        expect(JSON.parse(stdout)).to.deep.equal({
          options: {
            bar: true,
            a: true,
            B: 123,
            'cde-fgh': ['ijk'],
            cdeFgh: ['ijk'],
            c: ['ijk'],
            lmnOpq: 0,
            'lmn-opq': 0,
          },
          args: ['foo'],
        });
        done();
      }
    });
  });
});
