'use strict';

var moment = require('moment');

var customDayBoundsRE = /^\-?\d+\/\-?\d+$/;
var oldDayExpressionRE = /[\-\+\,]/;

module.exports = function parseDays(argv) {
  var startBase = moment().utc().startOf(argv.timeWindowType);
  var endBase = moment().utc().endOf(argv.timeWindowType);
  // console.log('startBase', startBase, 'endBase', endBase);
  if (typeof argv.timeWindowValue === 'number') {
    return [
      startBase.subtract(argv.timeWindowValue, argv.timeWindowType),
      endBase.add(argv.timeWindowValue, argv.timeWindowType)
    ];
  }

  else if (typeof argv.timeWindowValue === 'string') {
    if (customDayBoundsRE.test(argv.timeWindowValue)) {
      var ends = argv.timeWindowValue.split('/').map(parseFloat);
      return [
        startBase.subtract(ends[0], argv.timeWindowType),
        endBase.add(ends[1], argv.timeWindowType)
      ];
    }
    else if (oldDayExpressionRE.test(argv.timeWindowValue)) {
      throw new TypeError('the format of the --days flag has changed. run `makelogs --help` for more info.')
    }
  }

  else {
    throw new TypeError('Unable to determine the starting and end dates.');
  }
};
