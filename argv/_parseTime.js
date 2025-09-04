'use strict';

var moment = require('moment');

var customDayBoundsRE = /^\-?\d+\/\-?\d+$/;
var oldDayExpressionRE = /[\-\+\,]/;

module.exports = function parseDays(argv) {
  if (argv.days === null && argv.time === null) {
    var arg_time = '1d/1d';
  }
  else {
    if ( argv.days !== null ) {
      var arg_time = argv.days;
    }
    else {
      var arg_time = argv.time;
    }
  }
  var splitTime = arg_time.split("/");
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
      default:
        var endTimeType = "day";
        var endBaseValueTmp = endBaseTmp;
        break;
    }
  }

  var startBase = moment().utc().startOf(timeType);
  var endBase = moment().utc().endOf(endTimeType);
  // console.log(timeType, endTimeType, startBaseValueTmp, endBaseValueTmp,startBase.subtract(startBaseValueTmp, timeType), endBase.add(endBaseValueTmp, endTimeType));
  return [
    startBase.subtract(startBaseValueTmp, timeType),
    endBase.add(endBaseValueTmp, endTimeType),
    timeType
  ];
};
