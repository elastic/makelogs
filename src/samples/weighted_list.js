/**
 * @class WeightedList
 * @constructor
 */

module.exports = class WeightedList extends Array {
  constructor(list) {
    super()
    list.forEach(i => this.push(i))
  }

  /**
   * Add a value to the weighted list.
   * @method add
   * @param {Any} value
   * @param {Number} [weight] Optional.  Defaults to 1.
   * @return {Number} The index of the item that was added.
   */
  push(weight = 1, value) {
    Array.prototype.push.call(this, {
      value,
      weight,
    })

    delete this._sum
    delete this._totals

    return this.length - 1
  }

  get() {
    return this[this._randomIndex()].value
  }

  /**
   * Returns an index by weighted random distribution.
   * @method _randomIndex
   * @protected
   * @return {Number}
   */
  _randomIndex() {
    let maximumIndex
    let middleIndex
    let minimumIndex = 0
    let sum = this._sum
    let total
    let totals = this._totals

    if (!sum || !totals) {
      this._update()

      sum = this._sum
      totals = this._totals

      if (!sum || !totals || !totals.length) {
        return null
      }
    }

    maximumIndex = totals.length - 1
    const random = Math.random() * sum

    while (maximumIndex >= minimumIndex) {
      middleIndex = (maximumIndex + minimumIndex) / 2

      if (middleIndex < 0) {
        middleIndex = 0
      } else {
        middleIndex = Math.floor(middleIndex)
      }

      total = totals[middleIndex]

      if (random === total) {
        middleIndex += 1
        break
      } else if (random < total) {
        if (middleIndex && random > totals[middleIndex - 1]) {
          break
        }

        maximumIndex = middleIndex - 1
      } else if (random > total) {
        minimumIndex = middleIndex + 1
      }
    }

    return middleIndex
  }

  /**
   * Updates chached data for achieving weighted random distribution.
   * @method _update
   * @chainable
   * @protected
   */
  _update() {
    let sum = 0
    const totals = []

    this.forEach(item => {
      sum += item.weight
      totals.push(sum)
    })

    this._sum = sum
    this._totals = totals

    return this
  }
}
