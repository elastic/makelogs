const _ = require('lodash')

module.exports = function setupCount(argv) {
  if (_.isNumber(argv.count)) {
    return argv.count
  }

  const exprRE = /^(?:\d+(?:\.\d+)?)(b|m|t|h|k)+$/
  if (_.isString(argv.count) && argv.count.match(exprRE)) {
    // parses just the numbers off the front, ignores trailing characters
    const num = parseFloat(argv.count)
    let power = 0
    const chars = argv.count.split('')

    while (chars.length) {
      const char = chars.shift()
      switch (char) {
        case 'b':
          power += 9
          break
        case 'm':
          power += 6
          break
        case 't':
        case 'k':
          power += 3
          break
        case 'h':
          power += 2
          break
        default:
          throw new TypeError(`invalid count, unexpected "${char}"`)
      }
    }

    return num * Math.pow(10, power)
  }

  throw new TypeError('Unable to determine the event count.')
}
