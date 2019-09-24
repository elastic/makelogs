var inquirer = require('inquirer');

var argv = require('./argv');

module.exports = function () {
  return new Promise(function (resolve) {
    if (argv.reset != null) return resolve();

    inquirer.prompt([
      {
        type: 'confirm',
        name: 'reset',
        message: 'Existing ' + argv.indexPrefix + '* indices and/or index templates were found, can they be replaced?',
        default: true
      }
    ], function(answers) {
      resolve(answers.reset);
    });
  });
};
