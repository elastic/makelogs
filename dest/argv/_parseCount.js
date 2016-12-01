'use strict';

var _ = require('lodash');

module.exports = function setupCount(argv) {
  if (_.isNumber(argv.count)) {
    return argv.count;
  }

  var exprRE = /^(?:\d+(?:\.\d+)?)(b|m|t|h|k)+$/;
  if (_.isString(argv.count) && argv.count.match(exprRE)) {
    // parses just the numbers off the front, ignores trailing characters
    var num = parseFloat(argv.count);
    var power = 0;
    var chars = argv.count.split('');

    while (chars.length) {
      var char = chars.shift();
      switch (char) {
        case 'b':
          power += 9;
          break;
        case 'm':
          power += 6;
          break;
        case 't':
        case 'k':
          power += 3;
          break;
        case 'h':
          power += 2;
          break;
        default:
          throw new TypeError('invalid count, unexpected "' + char + '"');
      }
    }

    return num * Math.pow(10, power);
  }

  throw new TypeError('Unable to determine the event count.');
};
//# sourceMappingURL=_parseCount.js.map