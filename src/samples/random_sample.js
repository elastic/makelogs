/**
 * @class RandomList
 */

const _ = require('lodash')

module.exports = class RandomSample {
  constructor(min, max, list) {
    min = Math.max(min, 0)
    max = Math.min(max, _.size(list))

    this.get = () => {
      const n = _.random(min, max)
      let i = 0
      const sample = []

      makeSample:
        while (i < n) {
          const s = _.sample(list)
          for (let c = 0; c < i; c += 1) {
            if (sample[c] === s) continue makeSample
          }

          sample[i] = s
          i += 1
        }

      return sample
    }
  }
}
