const inquirer = require('inquirer')
const Bluebird = require('bluebird')

const argv = require('./argv')

module.exports = () => new Bluebird(resolve => {
  if (argv.reset != null) {
    resolve()
    return
  }

  inquirer.prompt([
    {
      type: 'confirm',
      name: 'reset',
      message: `Existing ${argv.indexPrefix}* indices and/or index templates were found, can they be replaced?`,
      default: true,
    },
  ], answers => {
    resolve(answers.reset)
  })
})
