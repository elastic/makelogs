"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class WeightedList
 * @constructor
 */

module.exports = function () {
  function WeightedList() {
    var _this = this;

    var valuesToWeights = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WeightedList);

    this._list = [];

    Object.keys(valuesToWeights).forEach(function (value) {
      _this.push(valuesToWeights[value], value);
    });
  }

  /**
   * Add a value to the weighted list.
   * @method add
   * @param {Any} value
   * @param {Number} [weight] Optional.  Defaults to 1.
   * @return {Number} The index of the item that was added.
   */


  _createClass(WeightedList, [{
    key: "push",
    value: function push() {
      var weight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var value = arguments[1];

      this._list.push({
        value: value,
        weight: weight
      });

      delete this._sum;
      delete this._totals;

      return this.length - 1;
    }
  }, {
    key: "get",
    value: function get() {
      return this._list[this._randomIndex()].value;
    }

    /**
     * Returns an index by weighted random distribution.
     * @method _randomIndex
     * @protected
     * @return {Number}
     */

  }, {
    key: "_randomIndex",
    value: function _randomIndex() {
      var maximumIndex = void 0;
      var middleIndex = void 0;
      var minimumIndex = 0;
      var sum = this._sum;
      var total = void 0;
      var totals = this._totals;

      if (!sum || !totals) {
        this._update();

        sum = this._sum;
        totals = this._totals;

        if (!sum || !totals || !totals.length) {
          return null;
        }
      }

      maximumIndex = totals.length - 1;
      var random = Math.random() * sum;

      while (maximumIndex >= minimumIndex) {
        middleIndex = (maximumIndex + minimumIndex) / 2;

        if (middleIndex < 0) {
          middleIndex = 0;
        } else {
          middleIndex = Math.floor(middleIndex);
        }

        total = totals[middleIndex];

        if (random === total) {
          middleIndex += 1;
          break;
        } else if (random < total) {
          if (middleIndex && random > totals[middleIndex - 1]) {
            break;
          }

          maximumIndex = middleIndex - 1;
        } else if (random > total) {
          minimumIndex = middleIndex + 1;
        }
      }

      return middleIndex;
    }

    /**
     * Updates chached data for achieving weighted random distribution.
     * @method _update
     * @chainable
     * @protected
     */

  }, {
    key: "_update",
    value: function _update() {
      var sum = 0;
      var totals = [];

      this._list.forEach(function (item) {
        sum += item.weight;
        totals.push(sum);
      });

      this._sum = sum;
      this._totals = totals;

      return this;
    }
  }]);

  return WeightedList;
}();
//# sourceMappingURL=weighted_list.js.map