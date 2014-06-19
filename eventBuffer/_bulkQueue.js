var async = require('async');
var Promise = require('bluebird');

var argv = require('../argv');
var createIndex = require('./_createIndex');
var client = require('../_client');

module.exports = function (eventBuffer) {
  // track the indices that we have ensured exist
  var checkedIndice = {};

  var queue = async.queue(function (events, done) {
    var body = [];
    var deps = [];
    var esBulkQueueOverflow = 0;

    events.forEach(function (event) {
      var header = event.header;
      event = event.body;

      if (checkedIndice[event.index] !== true) {
        deps.push(createIndex(event.index));
        checkedIndice[event.index] = true;
      }

      body.push({ index: header }, event);
    });

    Promise.all(deps)
    .then(function () {
      if (body.length) {
        argv.log('sending', body.length / 2, 'bulk requests');
        return client.bulk({
          body: body
        });
      } else {
        return {};
      }
    })
    .then(function (resp) {
      if (resp.errors) {
        resp.items.forEach(function (item, i) {
          if (item.index.error) {
            if (item.index.error.match(/^EsRejectedExecutionException/)) {
              esBulkQueueOverflow ++;
              eventBuffer.push(events[i]);
            }
          }
        });
      }
    })
    .finally(function () {
      if (esBulkQueueOverflow) {
        process.stdout.write('w' + esBulkQueueOverflow + '-');

        // pause for 10ms per queue overage
        queue.pause();
        setTimeout(function () {
          queue.resume();
        }, 10 * esBulkQueueOverflow);

      } else {
        argv.progress();
      }
    })
    .nodeify(done);
  }, 1);

  queue.drain = function () {
    if (eventBuffer.final && eventBuffer.length === 0) {
      client.close();
      process.stdout.write('.\n\ncreated ' + argv.total + ' events\n\n');
    } else {
      eventBuffer.flush();
    }
  };

  return queue;
};