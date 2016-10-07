const _ = require('lodash')
const argv = require('./argv')

const parseStringPropertyPath = require('./_parseStringPropertyPath')

if (!argv.omit) {
  module.exports = _.identity
  return
}

const rawPaths = (
  _.isArray(argv.omit)
  ? argv.omit
  : [ argv.omit ]
)
const paths = rawPaths.map(parseStringPropertyPath)

module.exports = (body, isFieldMap) => {
  let walkIn
  const unDefine = (obj, path) => {
    if (!obj) return

    const step = path.shift()
    let next = obj[step]

    if (path.length === 0) {
      // end of the line
      obj[step] = next = undefined
    } else if (next && step === '[]') {
      walkIn(next, path)
    } else if (next) {
      // FIXME Make this prettier
      if (isFieldMap) {
        unDefine(next.properties, path)
      } else {
        unDefine(next, path)
      }
    }

    path.unshift(step)
  }

  walkIn = (arr, path) => {
    if (!_.isArray(arr)) return

    arr.forEach(obj => {
      unDefine(obj, path)
    })
  }

  isFieldMap = !!isFieldMap
  paths.forEach(path => {
    unDefine(body, path)
  })

  return body
}
