'use strict';

var moment = require('moment');

var customDayBoundsRE = /^\-?\d+\/\-?\d+$/;
var oldDayExpressionRE = /[\-\+\,]/;

module.exports = function parseDays(argv) {
  // split argv.time with / char ----> 3d/2h
  // check last char of argv.time[0] to get hour minute days and set in new var1
  // check last char of argv.time[1] to get hour minute days and set in new var2
  // continue replacing argv.timeWindowType with new var1 and new var2
  var splitTime = argv.time.split("/");
  var startBaseTmp = splitTime[0];
  var startBaseTypeTmp = startBaseTmp.at(-1);
  
  switch (startBaseTypeTmp) {
    case 'd':
      var timeType = "day";
      var startBaseValueTmp = startBaseTmp.slice(0, -1);
      break;
    case 'h':
      var timeType = "hour";
      var startBaseValueTmp = startBaseTmp.slice(0, -1);
      break;
    case 'm':
      var timeType = "minute";
      var startBaseValueTmp = startBaseTmp.slice(0, -1);
      break;
    case 'w':
      var timeType = "week";
      var startBaseValueTmp = startBaseTmp.slice(0, -1);
      break;
    case 'y':
      var timeType = "year";
      var startBaseValueTmp = startBaseTmp.slice(0, -1);
      break;
    default:
      var timeType = "day";
      var startBaseValueTmp = startBaseTmp;
      break;
  }

  if (typeof splitTime[1] === "undefined"){
    endBaseTypeTmp = "d";
    endBaseValueTmp = 0;
    endTimeType = "d";
  }
  else {
    var endBaseTmp = splitTime[1];
    var endBaseTypeTmp = endBaseTmp.at(-1);
    switch (endBaseTypeTmp) {
      case 'd':
        var endTimeType = "day";
        var endBaseValueTmp = endBaseTmp.slice(0, -1);
        break;
      case 'h':
        var endTimeType = "hour";
        var endBaseValueTmp = endBaseTmp.slice(0, -1);
        break;
      case 'm':
        var endTimeType = "minute";
        var endBaseValueTmp = endBaseTmp.slice(0, -1);
        break;
      case 'w':
        var endTimeType = "week";
        var endBaseValueTmp = endBaseTmp.slice(0, -1);
        break;
      case 'y':
        var endTimeType = "year";
        var endBaseValueTmp = endBaseTmp.slice(0, -1);
        break;
      default:
        var endTimeType = "day";
        var endBaseValueTmp = endBaseTmp;
        break;
    }
  }


  var startBase = moment().utc().startOf(timeType);
  var endBase = moment().utc().endOf(endTimeType);
  // console.log('startBase', startBase, 'endBase', endBase);
  if (typeof argv.time === 'number') {
    return [
      startBase.subtract(argv.time, timeType),
      endBase.add(argv.time, endTimeType)
    ];
  }
  else if (typeof argv.time === 'string') {
    if (customDayBoundsRE.test(argv.time)) {
      var ends = argv.time.split('/').map(parseFloat);
      return [
        startBase.subtract(ends[0], timeType),
        endBase.add(ends[1], endTimeType)
      ];
    }
    else if (oldDayExpressionRE.test(argv.time)) {
      throw new TypeError('the format of the --days flag has changed. run `makelogs --help` for more info.')
    }
  }

  else {
    throw new TypeError('Unable to determine the starting and end dates.');
  }
};
