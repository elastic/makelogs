var inquirer = require('inquirer');

var argv = require('./argv');

module.exports = async function () {
  if (argv.reset != null) return resolve();

  const resp = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'reset',
      message: 'Existing ' + argv.indexPrefix + '* indices and/or index templates were found, can they be replaced?',
      default: true
    }
  ]);

  return resp.reset
};
