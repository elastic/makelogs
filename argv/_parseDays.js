var _ = require('lodash');
var moment = require('moment');

var customDayBoundsRE = /^\d+\/\d+$/;
var oldDayExpressionRE = /[\-\+\,]/;

module.exports = function parseDays(argv) {
  var startBase = moment().utc().startOf('day');
  var endBase = moment().utc().endOf('day');

  if (_.isNumber(argv.days)) {
    return [
      startBase.subtract(argv.days, 'days'),
      endBase.add(argv.days, 'days')
    ];
  }

  if (_.isString(argv.days)) {
    if (customDayBoundsRE.test(argv.days)) {
      var ends = argv.days.split('/').map(parseFloat);
      return [
        startBase.subtract(ends[0], 'days'),
        endBase.add(ends[1], 'days')
      ];
    }
    else if (oldDayExpressionRE.test(argv.days)) {
      throw new TypeError('the format of the --days flag has changed. run `makelogs --help` for more info.')
    }
  }

  throw new TypeError('Unable to determine the starting and end dates.');
};
