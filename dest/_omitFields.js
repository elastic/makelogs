'use strict';

var _ = require('lodash');
var argv = require('./argv');

var parseStringPropertyPath = require('./_parseStringPropertyPath');

module.exports = !argv.omit ? _.identity : function () {
  var rawPaths = _.isArray(argv.omit) ? argv.omit : [argv.omit];
  var paths = rawPaths.map(parseStringPropertyPath);

  return function (body, isFieldMap) {
    var walkIn = void 0;
    var unDefine = function unDefine(obj, path) {
      if (!obj) return;

      var step = path.shift();
      var next = obj[step];

      if (path.length === 0) {
        // end of the line
        obj[step] = next = undefined;
      } else if (next && step === '[]') {
        walkIn(next, path);
      } else if (next) {
        // FIXME Make this prettier
        if (isFieldMap) {
          unDefine(next.properties, path);
        } else {
          unDefine(next, path);
        }
      }

      path.unshift(step);
    };

    walkIn = function walkIn(arr, path) {
      if (!_.isArray(arr)) return;

      arr.forEach(function (obj) {
        unDefine(obj, path);
      });
    };

    isFieldMap = !!isFieldMap;
    paths.forEach(function (path) {
      unDefine(body, path);
    });

    return body;
  };
}();
//# sourceMappingURL=_omitFields.js.map