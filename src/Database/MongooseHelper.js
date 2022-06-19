
var mongoose  = require('mongoose');

const MSG_PREFIX="[MoongoseHelper] ";

 class MongooseHelper {

  constructor (name,option) { 
    this.type="mongoose";
    this.name = name;
    this.server = "mongodb://"+option.ip+":"+option.port+"/"+option.base

    this.mongoose = mongoose;
    //> For olds mongoose versions;
    // this.mongoose.set('useCreateIndex', true);
    // this.mongoose.set('useFindAndModify', false);
    // this.mongoose.set('useUnifiedTopology',true);
    this.createController = function(name,OriginSchema) {
        let MongooseSchema = this.mongoose.Schema;
        let Schema = new this.mongoose.Schema(OriginSchema);
        let Model = this.mongoose.model(name,Schema);
        return Model;
   }

    return this;
  }

 connect (server) {
    var _t = this;
     return new Promise((res,rej) => {

      setTimeout(function() {
        res(false);
      },3000)
       _t.mongoose.connect(this.server,
        { useNewUrlParser: true },
        (err, db) => {
          if (!err) {
        res(_t.mongoose);
        }else {
          res(false)
        }
      })
      })

      }
   do() {
    return this.db;
   }




}

module.exports = MongooseHelper;