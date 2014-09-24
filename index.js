/**
 * Notify user of updates
 */
var pkg = require('../package.json');
require('update-notifier')({ packageName: pkg.name, packageVersion: pkg.version }).notify();

var Promise = require('bluebird');
var client = require('./_client');
var randomEvent = require('./_randomEvent');
var samples = require('./samples');
var eventBuffer = require('./eventBuffer');
var argv = require('./argv');

var total = argv.total;
var startingMoment = argv.start;
var endingMoment = argv.end;

console.log('Generating', total, 'events from', startingMoment.format(), 'to', endingMoment.format());
if (argv.dry) process.exit();

Promise.resolve()
.then(function () {
  if (argv.reset) {
    argv.log('clearing existing logstash-* indices');
    return client.indices.delete({
      index: 'logstash-*'
    });
  }
})
.then(function () {
  argv.log('setting the bulk threadpool size to unlimited');
  return client.cluster.putSettings({
    body: {
      transient: {
        threadpool: {
          bulk: {
            queue_size: -1
          }
        }
      }
    }
  });
})
.then(function () {
  argv.log('creating', total, 'events');
  var i = total;
  return (function crunch() {
    argv.log('creating no more than', i, 'events');

    for (; i >= 0; i--) {
      var event = randomEvent();

      // eventBuffer.push might return a promise,
      var delay = eventBuffer.push({
        header: { _index: event.index, _type: samples.types() },
        body: event
      });

      if (delay) {
        argv.log('waiting for bulk to complete');
        // stop the loop and restart once complete
        return Promise.resolve(delay).then(crunch);
      }
    }
  }());
})
.then(function () {
  eventBuffer.push(false);
})
.catch(console.error.bind(console));