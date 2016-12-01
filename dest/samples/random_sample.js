'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class RandomList
 */

var _ = require('lodash');

module.exports = function RandomSample(min, max, list) {
  _classCallCheck(this, RandomSample);

  min = Math.max(min, 0);
  max = Math.min(max, _.size(list));

  this.get = function () {
    var n = _.random(min, max);
    var i = 0;
    var sample = [];

    makeSample: while (i < n) {
      var s = _.sample(list);
      for (var c = 0; c < i; c += 1) {
        if (sample[c] === s) continue makeSample;
      }

      sample[i] = s;
      i += 1;
    }

    return sample;
  };
};
//# sourceMappingURL=random_sample.js.map