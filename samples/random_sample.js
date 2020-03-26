'use strict';

/**
 * @class RandomList
 */

const random = (min, max) => (
  min + Math.floor(Math.random() * (max - min + 1))
)

module.exports = RandomSample;

function RandomSample(min, max, list) {
  min = Math.max(min, 0);
  max = Math.min(max, list.length);

  this.get = function () {
    var n = random(min, max);
    var i = 0;
    var sample = [];

    makeSample:
    while (i < n) {
      var s = list[random(0, list.length - 1)];
      for (var c = 0; c < i; c++) {
        if (sample[c] === s) continue makeSample;
      }

      sample[i] = s;
      i++;
    }

    return sample;
  };
}
