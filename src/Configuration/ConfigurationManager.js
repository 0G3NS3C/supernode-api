
let configurator = [];



const TYPE={JSON: 'json'};



var ConfigurationManager = {

      configs: [],
      new: function(options, index = null, callback=null ) {

        if (!options.name) {  throw new Error('ERROR : No options.name setted for configuration'); }
        if (!options.database) {
          throw new Error('ERROR : No options.database for Configuration Type');
        }
        else {
          if (!options.database.type) { throw new Error('ERROR : No type set for configuration database type'); }
          else if (!options.database.file) { throw new Error('ERROR : No file set for configuration database type'); }
          else {
            let config;
            if (options.database.type == TYPE.JSON) { let CM = require('./ConfigurationJSON.js'); config = new CM(options.name, options.database) };
            this.configs[options.name] = config;
            if (index) {
              config._index = {};
              index.forEach((e) => { config._index[e] = e });
              }
            return config
            }
          }
      },

      _saveAll: function() {
          for (c in this.configs) {
            this.configs[c].saveConfigurationrezrezr();
        }
      }

}


module.exports = ConfigurationManager;

