'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

module.exports = function () {
  function IpGenerator(maxCount, maxSessions) {
    _classCallCheck(this, IpGenerator);

    this.maxSessions = maxSessions;
    this.maxCount = maxCount;

    this.sessions = [];
  }

  _createClass(IpGenerator, [{
    key: 'get',
    value: function get() {
      var session = void 0;
      var index = void 0;

      if (this.sessions.length < this.maxSessions) {
        session = [this.makeRandom(), 0];
        index = this.sessions.length;
        this.sessions.push(session);
      } else {
        index = _.random(0, this.sessions.length - 1);
        session = this.sessions[index];
      }

      if (session[1] > this.maxCount) {
        this.sessions.splice(index, 1);
        return this.getIp();
      }

      return session[0];
    }
  }, {
    key: 'makeRandom',
    value: function makeRandom() {
      return _.random(0, 255) + '.' + _.random(0, 255) + '.' + _.random(0, 255) + '.' + _.random(0, 255);
    }
  }]);

  return IpGenerator;
}();
//# sourceMappingURL=ip_generator.js.map