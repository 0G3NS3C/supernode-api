
let fs = require('fs');

let { CONSOLE } = require('../server/utils.js')

var ConfigurationJSON = function(name,database) {

/**************************************
        CONSTRUCTOR
****************************************/


    this._name = name;
    this.data = {};
    this.file = database.file;
    this.autosave = database.autosave;
    this.saveonset = database.saveonset;
    this.defaultData = database.defaultData;

    let _this = this;
    let timeoutSave = null;
/**************************************
        CLASS METHODS
****************************************/

  this.set = function(index,value) {
    this.data[index]=value;
    if (this.saveonset) { this.saveConfiguration(true); }
  }

  this.get=function(index) {
    return this.data[index] || undefined;
  }

  this.existConfigurationFile = function() {
    return fs.existsSync(this.file);
  }


  this.loadConfigurationFile = function() {
  var data = fs.readFileSync(this.file, 'utf8')
            if (data) {
             try { this.data= JSON.parse(data,true); 
              if (this.defaultData) { this.data = extend(this.data,this.defaultData) }
                }
             catch(e) { }
           }else {
               this.data ={};
              if (this.defaultData) { this.data = this.data.concat(this.defaultData) } 
           }
  
  }
 
   this.saveConfiguration = async function(silent=true) {
      clearTimeout(timeoutSave);
       timeoutSave = setTimeout(function() {
           let json = JSON.stringify(this.data); //convert it back to json
           fs.writeFile(_this.file, '', 'utf8', function() {
               fs.writeFile(_this.file, json, 'utf8', function() { if (!silent) CONSOLE.DEFAULT('[Configuration:\x1b[32m'+_this._name+'\x1b[37m] SAVED in\x1b[32m '+_this.file); }); // write it back
           });
       }.bind(this),500);


   }


  /***** CONSTRUCTOR *****/

  if (this.existConfigurationFile()) {
      this.loadConfigurationFile()
  }
  if (this.autosave) {
      setInterval(function() {
        _this.saveConfiguration();
      },this.autosave)  
    }
}


function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}



module.exports = ConfigurationJSON;

