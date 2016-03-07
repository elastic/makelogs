var _ = require('lodash');
var moment = require('moment');

var customDayBoundsRE = /^\d+\/\d+$/g;

module.exports = function parseDays(argv) {
  var startBase = moment().utc().startOf('day');
  var endBase = moment().utc().endOf('day');

  if (_.isNumber(argv.days)) {
    return [
      startBase.subtract(argv.days, 'days'),
      endBase.add(argv.days, 'days')
    ];
  }

  if (_.isString(argv.days) && argv.days.match(customDayBoundsRE)) {
    var ends = argv.days.split('/').map(parseFloat);
    return [
      startBase.subtract(ends[0], 'days'),
      endBase.add(ends[1], 'days')
    ];
  }

  throw new TypeError('Unable to determine the starting and end dates.');
};
