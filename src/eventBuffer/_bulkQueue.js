const async = require('async')
const Promise = require('bluebird')
const _ = require('lodash')

const argv = require('../argv')
const client = require('../_client')

let first = true

module.exports = eventBuffer => {
  const queue = async.queue((events, done) => {
    const body = []
    let esBulkQueueOverflow = 0

    if (first) {
      argv.startedIndexing()
      first = false
    }

    events.forEach(event => {
      body.push({ index: event.header }, event.body)
    })

    Promise.resolve(client.usable)
    .then(() => {
      if (body.length) {
        argv.log('sending', body.length / 2, 'bulk requests')
        return client.bulk({ body })
      }

      return {}
    })
    .then(resp => {
      let eventCount = resp.items.length
      if (resp.errors) {
        resp.items.forEach((item, i) => {
          let error = (item.index || item.create).error
          if (_.isPlainObject(error) && error.reason) {
            error = error.reason
          }
          if (error) {
            eventCount -= 1

            if (error.match(/^EsRejectedExecutionException/)) {
              esBulkQueueOverflow += 1
              eventBuffer.push(events[i])
            } else {
              console.error(error)
              process.exit()
            }
          }
        })
      }

      argv.progress(eventCount)
    })
    .catch(err => {
      console.error(err.stack)
      throw err
    })
    .finally(() => {
      if (esBulkQueueOverflow) {
        // pause for 10ms per queue overage
        queue.pause()
        setTimeout(() => {
          queue.resume()
        }, 10 * esBulkQueueOverflow)
      }
    })
    .nodeify(done)
  }, 1)

  queue.drain = () => {
    if (eventBuffer.final && eventBuffer.length === 0) {
      client.close()
      argv.doneIndexing()
    } else {
      eventBuffer.flush()
    }
  }

  return queue
}
