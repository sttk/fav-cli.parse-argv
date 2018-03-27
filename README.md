# [@fav/cli.parse-argv][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage status][coverage-img]][coverage-url]

Parses command line arguments.

> "fav" is an abbreviation of "favorite" and also the acronym of "for all versions".
> This package is intended to support all Node.js versions as possible.
> At least, this package supports Node.js >= v0.10.


## Install

To install from npm:

```sh
$ npm install --save @fav/cli.parse-argv
```

***NOTE:*** *npm < 2.7.0 does not support scoped package, but old version Node.js supports it. So when you use such older npm, you should download this package from [github.com][repo-url], and move it in `node_modules/@fav/cli.parse-argv/` directory manually.*


## Usage

```sh
$ node sample.js --abc-def --ghi 123 -j=45 k 6
```

```js
(sample.js)
var parseArgv = require('@fav/cli.parse-argv');

parseArgv();
// => { options: { 'abc-def': true, abcDef: true, ghi: 123, j: 45 }, args: ['k', 6] }

parseArgv(process.argv.slice(2));
// => { options: { 'abc-def': true, abcDef: true, ghi: 123, j: 45 }, args: ['k', 6] }
```


## API

### <u>.parse([ argv ] [, configs ]) : object</u>

Parses command line arguments and returns a result object which has groups of options and normal arguments.

#### Parameters:

| Parameter   |  Type  | Description                            |
|:------------|:------:|:---------------------------------------|
| *argv*      | Array  | An argument array, or an array same with `process.argv.slice(2)` if not be specified. (Optional)  |
| *configs*   | object | An object which configure parsing. (Optional)  | 

#### Returns:

A parsed result object, of which keys are as follows:

* `args` [Array] : is an array of normal arguments.
* `options` [object] : is an object which has options represented by key-value pairs.

**Type:** object

#### Short options and long options

There are two types for options: **short option** and **long option**. A short option is single character following single hyphen (like `-c`). A long option is basically a kebab case string following double hyphens (like `--sss-sss`). An argument which doesn't start with hyphens is operated as a normal argument.

Both options can be followed by an equal mark and a value string (like `-c=vvv` or `--sss=vvv`). In this case, the option string is operated as an equation.

Short options can be concatenated to an option string (like `-abc` instead of `-a -b -c`). If such option string is followed by an equal mark and a value string, the value is set to the last short option (e.g. `-abc=1` is parsed into `a=true, b=true, c=1`).

If a long option can be converted to a camel case string which is different from an original option string, this function sets both an original option and a camel case option (e.g. `--abc-def` is parsed into `'abc-def'=true, abcDef=true`).

#### Parsing in default

If a parameter *configs* is not specified, this function parses command line arguments in default way. In default, all control-codes, marks, and numbers in ASCII characters are ignored as short options.

The normal argument which follows a option is always operated as a value of the option. Even if an argument starts with hyphens, but if it follows an option and can be converted to a number, it is operated as a value of the option.

The formats of short options are as follows:

| Format      | Value type   | Result                                           |
|:------------|:-------------|:-------------------------------------------------|
| -*c*        | true         | { options: { *c*: true, ...}, args: [...] }      |
| -*cnnn*     | number       | { options: { *c*: *nnn*, ...}, args: [...] }     |
| -*c*=*nnn*  | number       | { options: { *c*: *nnn*, ...}, args: [...] }     |
| -*c*=*sss*  | string       | { options: { *c*: '*sss*', ...}, args: [...] }   |
| -*c* *nnn*  | number       | { options: { *c*: *nnn*, ...}, args: [...] }     |
| -*c* -*nnn* | number       | { options: { *c*: -*nnn*, ...}, args: [...] }    |
| -*c* *sss*  | string       | { options: { *c*: '*sss*', ...}, args: [...] }   |

The formats of long options are as follows:

| Format               | Value type | Result                                             |
|:---------------------|:-----------|:---------------------------------------------------|
| --*sss*-*sss*        | true       | { options: { '*sss*-*sss*': true, *sssSss*: true, ...}, args: [...] } |
| --no-*sss*-*sss*     | false      | { options: { '*sss*-*sss*': false, sssSss: false, ...}, args: [...] } |
| --*sss*-*sss*=*nnn*  | number     | { options: { '*sss*-*sss*': *nnn*, sssSss: *nnn*, ...}, args: [...] } |
| --*sss*-*sss*=*sss*  | string     | { options: { '*sss*-*sss*': '*sss*', sssSss: '*sss*', ...}, args: [...] } |
| --*sss*-*sss* *nnn*  | number     | { options: { '*sss*-*sss*': *nnn*, sssSss: *nnn*, ...}, args: [...] } |
| --*sss*-*sss* -*nnn*  | number     | { options: { '*sss*-*sss*': -*nnn*, sssSss: -*nnn*, ...}, args: [...] } |
| --*sss*-*sss* *sss*  | string     | { options: { '*sss*-*sss*': '*sss*', sssSss: '*sss*', ...}, args: [...] } |

#### Parsing by configurations

If a parameter *configs* is specified, this function parss command line arguments according with a configuration in *configs* corresponding to each specified option.

Even if an option is followed by a normal argument, but if the `.type` property of the configuration for the option, the value of the option is `true`.
On the other hand, if an option is not followed by a normal argument (and is not equation format), and if `.type` property of a configuraton is `string` or `number`, then this function throws an error.

When a value of an option cannot be converted to the specified type or specified choices in *configs*, this function throws an error. The message of the error is a [specific JSON format](#error_message) string.

##### List of configuration keys

This function can configure parsing by a configuration object which can have the following keys. These keys are a subset of valid keys of [yargs][yargs-url]'s option. (But the behaiors are not entirely same with it.)

* `alias` [string | Array] : sets alias option name(s).
* `choices` [*any* | Array] : limits valid values of the option.
* `coerce` [function] : provides a synchronous function to coerce or transform the value(s) of the option.
* `default` [*any*] : sets a default value of the option if the option was not specified.
* `demandOption` [boolean] : demands that the option is given.
* `normalize` [boolean] : applys `path.normalize()` to the option.
* `requiresArg` [boolean] : requires that the option is specified with a value,
* `type` [string] : specifys the type of the option from following choices:
    * `'array'` : interprets the option as an array, even if the option was specified single value.
    * `'boolean'` : interprets the option as a boolean flag.
    * `'count'` : interprets the option as a count of boolean flags.
    * `'number'` : interprets the option as a number.
    * `'string'` : interprets the option as a string.

If `type` is `'array'`, the normal arguments following the option are all interpreted as elements of the option until appearance of the next option argument. The data type of elements is boolean if the option value is not specified, or number if the option value can be converted to a number, otherwise string.

If `type` is `'boolean'`, this function sets `true` if the option was specified, otherwise `false` unless `default` is not explicitly specified.

`choices`, `coerce` and `requiresArg` is available only when `type` is `'array'`, `'number'` and `'string'`. 

##### Parsing error message <a name="error_message"></a>

If this function failed to parse, it throws an error of which message is a JSON string. An object parsed back from the JSON string always has the following keys, and has more keys according to the error.

* `option` [string] : is the option name.
* `reason` [string] : is the reason of the parsing error.
    * `'noRequiredArg'` : If the option has no value though `config.requiresArg` is true. 
    * `'notInChoices'` : If the option is not in `config.choices`.
    * `'duplicatedNameOrAlias'` : If the option name or alias is already used.
    * `'noDemandedOption'` : If the option is not specified though `config.demandOption` is true.


## Checked                                                                      

### Node.js (4〜9)

| Platform  |   4    |   5    |   6    |   7    |   8    |   9    |
|:---------:|:------:|:------:|:------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|

### io.js (1〜3)

| Platform  |   1    |   2    |   3    |
|:---------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|

### Node.js (〜0.12)

| Platform  |  0.7   |  0.8   |  0.9   |  0.10  |  0.11  |  0.12  |
|:---------:|:------:|:------:|:------:|:------:|:------:|:------:|
| macOS     |        |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |        |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|


## License

Copyright (C) 2018 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/fav-cli.parse-argv/
[npm-img]: https://img.shields.io/badge/npm-v0.1.1-blue.svg
[npm-url]: https://www.npmjs.com/package/@fav/cli.parse-argv
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/licenses/MIT
[travis-img]: https://travis-ci.org/sttk/fav-cli.parse-argv.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/fav-cli.parse-argv
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/fav-cli.parse-argv?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/fav-cli-parse-argv
[coverage-img]: https://coveralls.io/repos/github/sttk/fav-cli.parse-argv/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/fav-cli.parse-argv?branch=master
[yargs-url]: https://github.com/yargs/yargs
