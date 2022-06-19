

const fs = require('fs');
const path = require('path');
const structure = require('./_structure.js');
const { CONSOLE } = require('../server/utils.js')
const { objectRecursive } = require('../injectors/modulesApi.js');

module.exports = () => ({
  config: null,
  scan: async function({ directory }) {
    let file = path.normalize(directory+structure.file.config);
    file = fs.existsSync(file) ? require(file) : null;
    this.config = file;
    file ? CONSOLE.DEFAULT('##> Config file ->\x1b[32m found \x1b[37m')
    : CONSOLE.DEFAULT('##> Config not found \x1b[37m')
    return this.config;
  },

  inject: objectRecursive,

});



