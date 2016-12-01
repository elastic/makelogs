'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runCli = undefined;

var runCli = exports.runCli = function () {
  var _ref = _asyncToGenerator(function* () {
    var success = yield (0, _client.initializeClient)({
      host: _argv2.default.hostname,
      port: _argv2.default.port,
      auth: _argv2.default.auth
    });

    if (!success) return;

    console.log('Generating', total, 'events from', startingMoment.format(), 'to', endingMoment.format());

    if (!_argv2.default.dry) {
      yield (0, _createIndex2.default)();
    }

    _argv2.default.log('creating', total, 'events');
    var i = total;

    yield function crunch() {
      _argv2.default.log('creating no more than', i, 'events');

      for (; i >= 0; i -= 1) {
        var event = (0, _randomEvent2.default)(indexPrefix);

        if (_argv2.default.dry) {
          console.log('\n\n', event);
          continue;
        }

        // eventBuffer.push might return a promise,
        var delay = _eventBuffer2.default.push({
          header: { _index: event.index, _type: _samples2.default.types() },
          body: event
        });

        if (delay) {
          _argv2.default.log('waiting for bulk to complete');
          // stop the loop and restart once complete
          return _bluebird2.default.resolve(delay).then(crunch);
        }
      }

      return undefined;
    }();

    if (!_argv2.default.dry) {
      _eventBuffer2.default.push(false);
    }
  });

  return function runCli() {
    return _ref.apply(this, arguments);
  };
}();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _client = require('./client');

var _randomEvent = require('./_randomEvent');

var _randomEvent2 = _interopRequireDefault(_randomEvent);

var _samples = require('./samples');

var _samples2 = _interopRequireDefault(_samples);

var _eventBuffer = require('./eventBuffer');

var _eventBuffer2 = _interopRequireDefault(_eventBuffer);

var _createIndex = require('./_createIndex');

var _createIndex2 = _interopRequireDefault(_createIndex);

var _argv = require('./argv');

var _argv2 = _interopRequireDefault(_argv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var total = _argv2.default.total;
var startingMoment = _argv2.default.start;
var endingMoment = _argv2.default.end;
var indexPrefix = _argv2.default.indexPrefix;
//# sourceMappingURL=index.js.map