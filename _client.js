var argv = require('./argv');
var es = require('elasticsearch');

var clientConfig = {};

if (argv.trace) {
  clientConfig.log = 'trace';
}

clientConfig.hosts = [
  {
    host: argv.host.split(":")[0],
    port: argv.host.split(":")[1] ? argv.host.split(":")[1] : "9200",
    auth: argv.auth
  }
];

module.exports = new es.Client(clientConfig);
