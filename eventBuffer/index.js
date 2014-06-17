var eventBuffer = [];
var argv = require('../argv');
var bulkQueue = require('./_bulkQueue')(eventBuffer);

eventBuffer.push = function (event) {
  // pushing false is the sign that we are done pushing
  if (event === false) {
    eventBuffer.final = true;
  } else {
    Array.prototype.push.call(eventBuffer, event);
  }

  if (eventBuffer.length === 3000 || eventBuffer.final) {
    eventBuffer.flush();
  }
};

// debounced a tiny bit so that all failed events in a
// bulk response will be retried together
var pending;
eventBuffer.flush = function () {
  if (pending) return;
  pending = setTimeout(function () {
    pending = clearTimeout(pending);

    argv.log('pushing', eventBuffer.length, 'events into the bulkQueue');
    bulkQueue.push([eventBuffer.splice(0)], function (err) {
      if (err) {
        console.error(err.resp);
        console.error(err.stack);
        process.exit();
      }
    });
  }, 15);
};

module.exports = eventBuffer;