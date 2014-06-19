var _ = require('lodash');
var moment = require('moment');

module.exports = function parseDays(argv) {
  var complexDateRE = /(\-|\+|)\d+,?/g;
  var moments = [];

  if (_.isNumber(argv.days)) {
    moments.push(moment().utc().subtract('days', argv.days));
    moments.push(moment().utc().add('days', argv.days));
    return moments;
  }

  if (_.isString(argv.days) && argv.days.match(complexDateRE)) {
    var ends = [], match;
    while (ends.length < 2 && (match = complexDateRE.exec(argv.days))) {
      ends.push(match);
    }

    if (ends.length === 1) {
      ends.push(ends[0]);
    }

    if (ends.length) {
      ends.forEach(function (end) {
        moments.push(moment().utc().add(parseFloat(end[0]), 'days'));
      });
      return moments;
    }
  }

  throw new TypeError('Unable to determine the starting and end dates.');
};