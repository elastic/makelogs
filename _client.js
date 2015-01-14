var argv = require('./argv');
var _ = require('lodash');
var Promise = require('bluebird');
var through2 = require('through2');
var parse = require('url').parse;
var Client = require('elasticsearch').Client;
var NoConnections = require('elasticsearch').errors.NoConnections;
var RequestTimeout = require('elasticsearch').errors.RequestTimeout;

var host = String(argv.host);
var proto = _.contains(host, '//') ? '' : '//';
var parsed = parse(proto + host, false, true);

var ms = 1000;
var client = module.exports = new Client({
  log: {
    type: 'stream',
    level: argv.trace ? 'trace' : 'warning',
    stream: through2(function (chunk, enc, cb) {
      client.usable.then(function () {
        process.stdout.write(chunk, enc);
        cb();
      });
    })
  },
  host: {
    host: parsed.hostname,
    port: parsed.port,
    auth: argv.auth
  }
});

client.usable = client.ping({
  requestTimeout: ms
})
.catch(function (err) {
  var notAlive = err instanceof NoConnections;
  var timeout = err instanceof RequestTimeout;

  if (notAlive || timeout) {
    console.error('Unable to connect to elasticsearch at %s within %d seconds', host, ms / 1000);
  } else {
    console.log('unknown ping error', err);
  }

  client.close();
  // prevent the promise from ever resolving or rejecting
  return new Promise(_.noop);
});