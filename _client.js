var argv = require('./argv');
var es = require('elasticsearch');

var clientConfig = {};

if (argv.trace) {
  clientConfig.log = 'trace';
}

clientConfig.hosts = [
  {
    host: argv.host,
    auth: argv.auth
  }
];

module.exports = new es.Client(clientConfig);
