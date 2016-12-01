"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class RandomList
 */

module.exports = function RandomList(list) {
  _classCallCheck(this, RandomList);

  this.get = function () {
    return list[Math.round(Math.random() * list.length)];
  };
};
//# sourceMappingURL=random_list.js.map