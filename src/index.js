import Bluebird from 'bluebird'

import { initializeClient } from './client'
import randomEvent from './_randomEvent'
import samples from './samples'
import eventBuffer from './eventBuffer'
import createIndex from './_createIndex'
import argv from './argv'

const total = argv.total
const startingMoment = argv.start
const endingMoment = argv.end
const indexPrefix = argv.indexPrefix

export async function runCli() {
  const success = await initializeClient({
    host: argv.hostname,
    port: argv.port,
    auth: argv.auth,
  })

  if (!success) return

  console.log(
    'Generating', total, 'events from',
    startingMoment.format(), 'to', endingMoment.format()
  )

  if (!argv.dry) {
    await createIndex()
  }

  argv.log('creating', total, 'events')
  let i = total

  await (function crunch() {
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
        return Bluebird.resolve(delay).then(crunch)
      }
    }

    return undefined
  }())

  if (!argv.dry) {
    eventBuffer.push(false)
  }
}
