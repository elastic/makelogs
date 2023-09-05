'use strict';

var join = require('path').join;
var read = require('fs').readFileSync;
var program = require('commander').program;

program
  .name('makelogs')
  .description('A utility to generate sample log data.')
  .option('-c, --count <number>', 'Total event that will be created, accepts expressions like "1m" for 1 million (b,m,t,h)', parseNumber, 14000)
  .requiredOption('-d, --days <number>', 'Number of days ± today to generate data for. Use one number or two separated by a slash, e.g. "1/10" to go back one day, and forward 10', parseNumber, 1)
  .option('--url <url>', 'Elasticsearch url, overrides host and auth, can include any url part.')
  .option('-h, --host <host>', 'The host name and port', 'localhost:9200')
  .option('--auth <auth>', 'user:password when you want to connect to a secured elasticsearch cluster over basic auth', null)
  .option('--indexPrefix <name>', 'Name of the prefix of the index', 'logstash-')
  .option('-s, --shards <number>', 'The number of primary shards', parseNumberStrict, 1)
  .option('-r, --replicas <number>', 'The number of replica shards', parseNumberStrict, 0)
  .option('--dry', 'Test/Parse your arguments, but don\'t actually do anything')
  .option('--reset', 'Clear all {prefix}-* indices and the makelogs index template before generating (default: prompt)')
  .option('--no-reset', 'Do not clear all {prefix}-* indices and the makelogs index template before generating (default: prompt)')
  .option('--verbose', 'Log more info to the console')
  .option('--trace', 'Log every request to elasticsearch, including request bodies. BE CAREFUL!')
  .option('-o, --omit <...>', 'Omit a field from every event. See "formatting an omit path"')
  .option('-i, --indexInterval <...>', 'The interval that indices should roll over, either "daily", "monthly", "yearly", or a number of documents.', parseIndexInterval, 100000)
  .option('--types', 'Pass to enable types in index and document creation')
  .option('--indexTemplatesV1', 'Pass to enable types in index templates v1 compatibility')
  .option('--insecure', 'Pass to set ssl:{ rejectUnauthorized: false, pfx: [] }')
    .option('--apiKey <api-key>', 'set elastic cloud api key auth')
  .version(require('../package.json').version)
  .helpOption('--help', 'This help message')
  .on('--help', function () {
    var OMIT_HELP_PATH = join(__dirname, 'omitFormatting.txt');
    console.log('\n' + read(OMIT_HELP_PATH, 'utf8'));
  });

program.parse(process.argv);

// get the start and end moments
var moments = require('./_parseDays')(program);
program.start = moments[0];
program.end = moments[1];

// parsing allows short notation like "10m" or "1b"
program.total = require('./_parseCount')(program);


// since logging is based on the verbose command line flag??
program.log = program.verbose ? (...args) => console.log(...args) : () => {};

require('./_progress')(program);

module.exports = program;

function parseNumber (str) {
  var num = Number(str)
  return isNaN(num) ? str : num
}

function parseNumberStrict (str) {
  var num = parseInt(str, 10);
  if (isNaN(num)) {
    throw new TypeError(`${str} is not a number`);
  }
  return num
}

function parseIndexInterval (str) {
  switch (str) {
    case 'daily':
    case 'weekly':
    case 'monthly':
    case 'yearly':
      return str;
    default:
      return parseNumberStrict(str);
  }
}
