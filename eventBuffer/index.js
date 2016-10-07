const eventBuffer = []
const argv = require('../argv')
const Promise = require('bluebird')
const omitFields = require('../_omitFields')
const bulkQueue = require('./_bulkQueue')(eventBuffer)

eventBuffer.push = event => {
  // pushing false is the sign that we are done pushing
  if (event === false) {
    eventBuffer.final = true
  } else {
    omitFields(event.body)
    Array.prototype.push.call(eventBuffer, event)
  }

  if (eventBuffer.length === 3000 || eventBuffer.final) {
    return eventBuffer.flush()
  }

  return undefined
}

// debounced a tiny bit so that all failed events in a
// bulk response will be retried together
let pending
eventBuffer.flush = () => {
  if (pending) return pending

  pending = Promise.delay(1)
  .then(() => {
    pending = null

    return new Promise(resolve => {
      argv.log('pushing', eventBuffer.length, 'events into the bulkQueue')
      bulkQueue.push([ eventBuffer.splice(0) ], err => {
        if (err) {
          console.error(err.resp)
          console.error(err.stack)
          process.exit()
        } else {
          resolve()
        }
      })
    })
  })

  return pending
}

module.exports = eventBuffer
