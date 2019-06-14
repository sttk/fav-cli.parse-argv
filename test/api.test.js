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
        '--host', '192.168.1.10', '-p', '8080', '-LLL',
      ].join(' '), cb);
      function cb(err, stdout, stderr) {
        expect(err).to.equal(null);
        expect(stderr).to.equal('');
        expect(JSON.parse(stdout)).to.deep.equal({
          options: {
            host: '192.168.1.10',
            h: '192.168.1.10',
            port: 8080,
            p: 8080,
            'log-level': 3,
            logLevel: 3,
            L: 3,
          },
          args: [],
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
            h: 'www.domain.com',
            host: 'www.domain.com',
            port: 80,
            p: 80,
            L: 1,
            'log-level': 1,
            logLevel: 1,
          },
          args: ['foo'],
        });
        done();
      }
    });
  });
});
