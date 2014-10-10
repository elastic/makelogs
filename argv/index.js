var _ = require('lodash');
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
      describe: 'The number of days ± today or two numbers, seperated by a comma' +
        ', like "-1,+10" or "-10,+100"',
      default: 1
    },
    host: {
      alias: 'h',
      describe: 'The host name and port',
      default: null
    },
    auth: {
      describe: 'user:password when you want to connect to a secured elasticsearch cluster over basic auth',
      default: null
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
      describe: 'Clear all logstash-* indices before genrating logs',
      type: 'boolean'
    },
    verbose: {
      describe: 'Log more info to the console',
      type: 'boolean'
    },
    trace: {
      describe: 'Log every request to elastisearch, including request bodies. BE CAREFULL',
      type: 'boolean'
    }
  });

var argv = optimist.argv;

if (argv.help) {
  optimist.showHelp(console.log);
  process.exit();
}

// get the start and end moments
var moments = require('./_parseDays')(argv);
argv.start = moments[0];
argv.end = moments[1];

// parsing allows short notation like "10m" or "1b"
argv.total = require('./_parseCount')(argv);


// since logging is based on the verbose command line flag??
argv.log = argv.verbose ? _.bind(console.log, console) : _.noop;
argv.progress = argv.verbose
  ? _.bind(console.log, console, 'bulk request complete\n')
  : _.bind(process.stdout.write, process.stdout, '.');

module.exports = argv;