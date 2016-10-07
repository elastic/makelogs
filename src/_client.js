const argv = require('./argv')
const _ = require('lodash')
const Promise = require('bluebird')
const through2 = require('through2')
const elasticsearch = require('elasticsearch')
const { parse } = require('url')

const Client = elasticsearch.Client
const NoConnections = elasticsearch.errors.NoConnections
const RequestTimeout = elasticsearch.errors.RequestTimeout

const host = String(argv.host)
const proto = _.contains(host, '//') ? '' : '//'
const parsed = parse(proto + host, false, true)

let makeUseable
const usable = new Promise(resolve => {
  makeUseable = resolve
})

const ms = 5000
const client = module.exports = new Client({
  log: {
    type: 'stream',
    level: argv.trace ? 'trace' : 'warning',
    stream: through2((chunk, enc, cb) => {
      usable.then(() => {
        process.stdout.write(chunk, enc)
        cb()
      })
    }),
  },
  host: {
    host: parsed.hostname,
    port: parsed.port,
    auth: argv.auth,
  },
})

client.usable = usable

client.ping({
  requestTimeout: ms,
})
.then(() => {
  makeUseable()
})
.catch(err => {
  const notAlive = err instanceof NoConnections
  const timeout = err instanceof RequestTimeout

  if (notAlive || timeout) {
    console.error('Unable to connect to elasticsearch at %s within %d seconds', host, ms / 1000)
  } else {
    console.log('unknown ping error', err)
  }

  client.close()
  // prevent the promise from ever resolving or rejecting
  return new Promise(_.noop)
})
