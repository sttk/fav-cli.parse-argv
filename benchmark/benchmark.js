'use strict'

const BenchmarkTester = require('benchmark-tester')

console.log('Without Config')

new BenchmarkTester()
  .addTest('yargs', (yargs, argv) => {
    return yargs.parse(argv)
  })
  .addTest('@fav/cli.parse-argv', (parse, argv) => {
    return parse(argv)
  })

  .runTest('Empty', [])
  .runTest('Normal Args', ['abc', '123', 'path/to/file'])
  .runTest('Short Options', ['-ab', '-de', 'FGH', '-ij456', '-k=LMN'])
  .runTest('Long Options', ['--abc-def', '--ghi-jkl', 'MNOPQ'])

  .print()

console.log('With Configs')

const configs = {
  run: {
    alias: 'r',
    describe: 'run your program',
    type: 'string',
  },
  path: {
    alias: 'p',
    describe: 'provide a path to file',
    type: 'string',
  },
  spec: {
    alias: 's',
    type: 'string',
    describe: 'program specifications'
  }
}

new BenchmarkTester()
  .addPackage('yargs', require('yargs').options(configs))

  .addTest('yargs', (yargs, argv) => {
    return yargs.parse(argv)
  })
  .addTest('@fav/cli.parse-argv', (parse, argv) => {
    return parse(argv, configs)
  })

  .runTest('Empty', [])
  .runTest('Normal Args', ['abc', '123', 'path/to/file'])
  .runTest('Short Options', ['-r=program', '-p', 'path/to/file'])
  .runTest('Long Options', ['--run', 'program', '--path', 'path/to/file'])
  .print()
