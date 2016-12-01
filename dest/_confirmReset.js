'use strict';

var inquirer = require('inquirer');
var Bluebird = require('bluebird');

var argv = require('./argv');

module.exports = function () {
  return new Bluebird(function (resolve) {
    if (argv.reset != null) {
      resolve();
      return;
    }

    inquirer.prompt([{
      type: 'confirm',
      name: 'reset',
      message: 'Existing ' + argv.indexPrefix + '* indices and/or index templates were found, can they be replaced?',
      default: true
    }], function (answers) {
      resolve(answers.reset);
    });
  });
};
//# sourceMappingURL=_confirmReset.js.map