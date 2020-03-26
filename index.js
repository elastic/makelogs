'use strict';

/**
 * Notify user of updates
 */
var pkg = require('./package.json');
require('update-notifier')({ packageName: pkg.name, packageVersion: pkg.version }).notify();

var client = require('./_client');
var randomEvent = require('./_randomEvent');
var samples = require('./samples');
var eventBuffer = require('./eventBuffer');
var createIndex = require('./_createIndex');
var argv = require('./argv');

var total = argv.total;
var startingMoment = argv.start;
var endingMoment = argv.end;
var indexPrefix  = argv.indexPrefix;

client.usable
.then(function () {
  console.log('Generating', total, 'events from', startingMoment.format(), 'to', endingMoment.format());
})
.then(function () {
  if (argv.dry) return;
  return createIndex();
})
.then(function () {
  argv.log('creating', total, 'events');
  var i = total;
  return (function crunch() {
    argv.log('creating no more than', i, 'events');

    for (; i >= 0; i--) {
      var event = randomEvent(indexPrefix);

      if (argv.dry) {
        console.log('\n\n', event);
        continue;
      }

      var header = { _index: event.index };
      if (argv.types) {
        header._type = '_doc';
      }

      // eventBuffer.push might return a promise,
      var delay = eventBuffer.push({
        header,
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
  if (argv.dry) return;
  eventBuffer.push(false);
})
.catch(function (err) {
  console.error(err.stack);
});
