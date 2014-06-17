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
  var i = total;
  return (function crunch(event) {
    if (--i <= -1) return;
    eventBuffer.push({
      header: { _index: event.index, _type: samples.types(), _id: i, },
      body: event
    });

    // async so that there is time to process the queue
    return Promise.resolve(randomEvent()).then(crunch);
  }(randomEvent()));
})
.then(function () {
  eventBuffer.push(false);
})
.catch(console.error.bind(console));