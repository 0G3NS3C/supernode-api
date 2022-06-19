

const fs = require('fs');
const { CONSOLE } = require('../server/utils.js')
const structure = require('./_structure.js');
const path = require('path');
var ncp = require('ncp').ncp;
var Api = require('./Api.js');
const { capitalizeFirstLetter } = require('../server/utils.js');

global.node = {}; //<-- /!\ it will be accessible everywhere.

module.exports = function() {

  this.API_SYSTEM_LAYER = null;
  this.API = {};

  this.construct = async function(env) {
    var _t = this, wait=[];

    if (!this.API_SYSTEM_LAYER || !this.API_SYSTEM_LAYER.isPrepared()) {
      this.API_SYSTEM_LAYER = await new Api({env, api_directory: path.normalize(__dirname+'/../api/')}) 
      await this.API_SYSTEM_LAYER.prepare(); 
    }
      this.API_SYSTEM_LAYER = Object.assign({}, this.API_SYSTEM_LAYER);
      this.API = new Api({env , name: env.get(env._index.API_NAME), api_directory: path.normalize(structure.path.api+"/")});
      await this.API.prepare();
      await this.API_SYSTEM_LAYER.inject(this.API);
      let Context = this.API_SYSTEM_LAYER.getContext();
      for (let c in Context) node[c] = Context[c];
      //node.$ENV = env;
      return this.API_SYSTEM_LAYER;
  };


}



