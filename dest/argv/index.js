'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ = require('lodash');
var join = require('path').join;
var read = require('fs').readFileSync;

var OMIT_HELP_PATH = join(__dirname, 'omitFormatting.txt');

var optimist = require('optimist').usage('A utility to generate sample log data.\n\nUsage: $0 [options]').options({
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
    describe: 'Mumber of days ± today to generate data for. Use one number or two seperated by a slash' + ', e.g. "1/10" to go back one day, and forward 10',
    default: 1
  },
  host: {
    alias: 'h',
    describe: 'DEPRECATED'
  },
  hostname: {
    alias: 'H',
    describe: 'The elasticsearch hostname',
    default: 'localhost'
  },
  port: {
    alias: 'p',
    type: 'number',
    describe: 'The elasticsearch port',
    default: 9200
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
    describe: 'Clear all {prefix}-* indices and the makelogs index template before genrating',
    type: 'boolean',
    default: null
  },
  verbose: {
    describe: 'Log more info to the console',
    type: 'boolean'
  },
  trace: {
    describe: 'Log every request to elastisearch, including request bodies. BE CAREFULL',
    type: 'boolean'
  },
  omit: {
    alias: 'o',
    describe: 'Omit a field from every event. See "formatting an omit path"',
    type: 'string'
  },
  indexInterval: {
    alias: 'i',
    describe: 'The interval that indices should roll over, either "daily", ' + '"monthly", "yearly", or a number of documents.',
    default: 100000
  }
});

var argv = optimist.argv;

if (argv.help) {
  optimist.showHelp(console.log);
  console.log(read(OMIT_HELP_PATH, 'utf8'));

  process.exit();
}

if (argv.host) {
  console.log('[DEPRECATED]: --host and -h flags are deprecated, use --hostname and --port instead');
  var _argv$host$split = argv.host.split(':');

  var _argv$host$split2 = _slicedToArray(_argv$host$split, 2);

  var _argv$host$split2$ = _argv$host$split2[0];
  argv.hostname = _argv$host$split2$ === undefined ? argv.hostname : _argv$host$split2$;
  var _argv$host$split2$2 = _argv$host$split2[1];
  argv.port = _argv$host$split2$2 === undefined ? argv.port : _argv$host$split2$2;
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
argv.log = argv.verbose ? _.bind(console.log, console) : _.noop;

require('./_progress')(argv);

module.exports = argv;
//# sourceMappingURL=index.js.map