const ProgressBar = require('progress')
const _ = require('lodash')

module.exports = argv => {
  let start
  let fallbackUpdateTimeout
  let progressBar

  argv.startedIndexing = () => {
    start = Date.now()
  }

  argv.pausing = () => {

  }

  if (argv.verbose) {
    argv.progress = _.bind(console.log, console, 'bulk request indexed %s documents \n')
  } else {
    argv.progress = function update(indexedCount) {
      if (!progressBar) {
        progressBar = new ProgressBar('indexing [:bar] :percent :etas ', {
          total: argv.total,
          incomplete: ' ',
          width: 80,
        })

        progressBar.destroy = () => {
          progressBar.terminate()
          fallbackUpdateTimeout = clearTimeout(fallbackUpdateTimeout)
        }
      }

      progressBar.tick(indexedCount || 0)
      fallbackUpdateTimeout = clearTimeout(fallbackUpdateTimeout)
      fallbackUpdateTimeout = setTimeout(update, 1000)
    }
  }

  argv.doneIndexing = () => {
    const end = Date.now()
    const time = Math.round((end - start) / 1000)
    console.log(`\ncreated ${argv.total} events in ${time} seconds.`)
    if (progressBar) progressBar.destroy()
  }
}
