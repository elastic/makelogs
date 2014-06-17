var async = require('async');

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

async.series([
  function (done) {
    if (argv.reset) {
      argv.log('clearing existing logstash-* indices');
      client.indices.delete({
        index: 'logstash-*'
      }, done);
    } else {
      done();
    }
  },
  function (done) {
    argv.log('setting the bulk threadpool size to unlimited');
    client.cluster.putSettings({
      body: {
        transient: {
          threadpool: {
            bulk: {
              queue_size: -1
            }
          }
        }
      }
    }, done);
  },
  function (done) {
    async.timesSeries(total, function (i, done) {
      var event = randomEvent();

      eventBuffer.push({
        header: {
          _index: event.index,
          _type: samples.types(),
          _id: i,
        },
        body: event
      });

      // setImmediate because this event creation loop would be sync
      // otherwise, we need to give the buffer and client time to send
      // their events
      setImmediate(done);
    }, done);
  }
], function (err) {
  if (err) throw err;
  // alert the event buffer that we are not going to be writing any more
  eventBuffer.push(false);
});