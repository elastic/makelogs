/**
 * Notify user of updates
 */
const pkg = require('./package.json')
require('update-notifier')({ packageName: pkg.name, packageVersion: pkg.version }).notify()

const Promise = require('bluebird')
const client = require('./_client')
const randomEvent = require('./_randomEvent')
const samples = require('./samples')
const eventBuffer = require('./eventBuffer')
const createIndex = require('./_createIndex')
const argv = require('./argv')

const total = argv.total
const startingMoment = argv.start
const endingMoment = argv.end
const indexPrefix = argv.indexPrefix

client.usable
.then(() => {
  console.log('Generating', total, 'events from', startingMoment.format(), 'to', endingMoment.format())
})
.then(() => {
  if (argv.dry) return undefined
  return createIndex()
})
.then(() => {
  argv.log('creating', total, 'events')
  let i = total
  return (function crunch() {
    argv.log('creating no more than', i, 'events')

    for (; i >= 0; i -= 1) {
      const event = randomEvent(indexPrefix)

      if (argv.dry) {
        console.log('\n\n', event)
        continue
      }

      // eventBuffer.push might return a promise,
      const delay = eventBuffer.push({
        header: { _index: event.index, _type: samples.types() },
        body: event,
      })

      if (delay) {
        argv.log('waiting for bulk to complete')
        // stop the loop and restart once complete
        return Promise.resolve(delay).then(crunch)
      }
    }

    return undefined
  }())
})
.then(() => {
  if (argv.dry) return
  eventBuffer.push(false)
})
.catch(err => {
  console.error(err.stack)
})
