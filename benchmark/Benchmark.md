# Benchmark test of @fav/cli.parse-argv

Comparing with following modules:

* [yargs](https://www.npmjs.com/package/yargs)

## v0.1.1

### Without Config

|               | yargs(13.2.4)  | @fav/cli.parse-argv(0.1.1) |
|:--------------|---------------:|---------------------------:|
| Empty         | 52,256 ops/sec |        150,164,280 ops/sec |
| Normal Args   | 37,865 ops/sec |          2,465,833 ops/sec |
| Short Options |  9,251 ops/sec |            368,096 ops/sec |
| Long Options  | 13,108 ops/sec |            240,600 ops/sec |

- Platform: Node.js 12.2.0 on Darwin 64-bit
- Machine: Intel(R) Core(TM) i7-2620M CPU @ 2.70GHz, 16GB

### With Configs

|               | yargs          | @fav/cli.parse-argv(0.1.1) |
|:--------------|---------------:|---------------------------:|
| Empty         | 33,593 ops/sec |             53,748 ops/sec |
| Normal Args   | 27,627 ops/sec |             55,190 ops/sec |
| Short Options | 16,316 ops/sec |             55,581 ops/sec |
| Long Options  | 16,657 ops/sec |             53,058 ops/sec |

- Platform: Node.js 12.2.0 on Darwin 64-bit
- Machine: Intel(R) Core(TM) i7-2620M CPU @ 2.70GHz, 16GB
