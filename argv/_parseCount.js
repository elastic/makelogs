module.exports = function setupCount(argv) {
  if (typeof argv.count === 'number') {
    return argv.count;
  }

  var exprRE = /^(?:\d+(?:\.\d+)?)(b|m|t|h|k)+$/;
  if (typeof argv.count === 'string' && argv.count.match(exprRE)) {
    // parses just the numbers off the front, ignores trailing characters
    var num = parseFloat(argv.count);
    var power = 0;
    var chars = argv.count.split('');

    while (chars.length) {
      switch (chars.shift()) {
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
      }
    }

    return num * Math.pow(10, power);
  }

  throw new TypeError('Unable to determine the event count.');
};