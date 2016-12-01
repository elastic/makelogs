'use strict';

var eventBuffer = [];
var argv = require('../argv');
var Bluebird = require('bluebird');
var omitFields = require('../_omitFields');
var bulkQueue = require('./_bulkQueue')(eventBuffer);

eventBuffer.push = function (event) {
  // pushing false is the sign that we are done pushing
  if (event === false) {
    eventBuffer.final = true;
  } else {
    omitFields(event.body);
    Array.prototype.push.call(eventBuffer, event);
  }

  if (eventBuffer.length === 3000 || eventBuffer.final) {
    return eventBuffer.flush();
  }

  return undefined;
};

// debounced a tiny bit so that all failed events in a
// bulk response will be retried together
var pending = void 0;
eventBuffer.flush = function () {
  if (pending) return pending;

  pending = Bluebird.delay(1).then(function () {
    pending = null;

    return new Bluebird(function (resolve) {
      argv.log('pushing', eventBuffer.length, 'events into the bulkQueue');
      bulkQueue.push([eventBuffer.splice(0)], function (err) {
        if (err) {
          console.error(err.resp);
          console.error(err.stack);
          process.exit();
        } else {
          resolve();
        }
      });
    });
  });

  return pending;
};

module.exports = eventBuffer;
//# sourceMappingURL=index.js.map