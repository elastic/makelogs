"use strict";

module.exports = function (stoch) {
  return function () {
    return Math.round(stoch.get.apply(stoch, arguments));
  };
};
//# sourceMappingURL=round_all_gets.js.map