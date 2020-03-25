'use strict';

var join = require('path').join;
var read = require('fs').readFileSync;

var OMIT_HELP_PATH = join(__dirname, 'omitFormatting.txt');

var optimist = require('optimist')
  .usage('A utility to generate sample log data.\n\nUsage: $0 [options]')
  .options({
    count: {
      alias: 'c',
      type: 'number',
      default: 14000,
      describe: 'Total event that will be created, accepts expressions like "1m" for 1 million (b,m,t,h)'
    },
    days: {
      alias: 'd',
      type: 'number',
      required: true,
      describe: 'Number of days ± today to generate data for. Use one number or two separated by a slash' +
        ', e.g. "1/10" to go back one day, and forward 10',
      default: 1
    },
    url: {
      describe: 'Elasticsearch url, overrides host and auth, can include any url part.'
    },
    host: {
      alias: 'h',
      describe: 'The host name and port',
      default: 'localhost:9200'
    },
    auth: {
      describe: 'user:password when you want to connect to a secured elasticsearch cluster over basic auth',
      default: null
    },
    indexPrefix: {
      describe: 'Name of the prefix of the index',
      default: 'logstash-'
    },
    shards: {
      alias: 's',
      describe: 'The number of primary shards',
      default: 1
    },
    replicas: {
      alias: 'r',
      describe: 'The number of replica shards',
      default: 0
    },
    dry: {
      describe: 'Test/Parse your arguments, but don\'t actually do anything',
      default: false
    },
    help: {
      describe: 'This help message',
      type: 'boolean'
    },
    reset: {
      describe: 'Clear all {prefix}-* indices and the makelogs index template before generating',
      type: 'boolean',
      default: null
    },
    verbose: {
      describe: 'Log more info to the console',
      type: 'boolean'
    },
    trace: {
      describe: 'Log every request to elasticsearch, including request bodies. BE CAREFUL!',
      type: 'boolean'
    },
    omit: {
      alias: 'o',
      describe: 'Omit a field from every event. See "formatting an omit path"',
      type: 'string'
    },
    indexInterval: {
      alias: 'i',
      describe: 'The interval that indices should roll over, either "daily", "monthly", "yearly", or a number of documents.',
      default: 100000
    },
    types: {
      describe: 'Pass to enable types in index and document creation',
      type: 'boolean',
      default: false,
    }
  });

var argv = optimist.argv;

if (argv.help) {
  optimist.showHelp(console.log);
  console.log(read(OMIT_HELP_PATH, 'utf8'));

  process.exit();
}

switch (argv.indexInterval) {
  case 'daily':
  case 'weekly':
  case 'monthly':
  case 'yearly':
    break;
  default:
    argv.indexInterval = parseInt(argv.indexInterval, 10);
    if (isNaN(argv.indexInterval)) {
      throw new Error('invalid indexInterval');
    }
    break;
}

// get the start and end moments
var moments = require('./_parseDays')(argv);
argv.start = moments[0];
argv.end = moments[1];

// parsing allows short notation like "10m" or "1b"
argv.total = require('./_parseCount')(argv);


// since logging is based on the verbose command line flag??
argv.log = argv.verbose ? (...args) => console.log(...args) : () => {};

require('./_progress')(argv);

module.exports = argv;
