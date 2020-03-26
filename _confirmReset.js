'use strict';

var inquirer = require('inquirer');

module.exports = async function (argv) {
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
