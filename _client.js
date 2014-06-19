var argv = require('./argv');
var es = require('elasticsearch');

var clientConfig = {};

if (argv.trace) {
  clientConfig.log = 'trace';
}

if (argv.host) {
  clientConfig.hosts = argv.host;
} else if (argv.hosts) {
  clientConfig.hosts = JSON.parse(argv.hosts);
}

module.exports = new es.Client(clientConfig);
