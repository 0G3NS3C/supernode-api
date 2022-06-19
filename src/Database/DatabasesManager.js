
let { CONSOLE } = require('../server/utils.js')


const DB_TYPE_MONGO = "mongodb";
const DB_TYPE_MONGOOSE ="mongoose";
const DB_TYPE_MYSQL = "mysql";
const DB_TYPES = [ DB_TYPE_MONGO, DB_TYPE_MYSQL, DB_TYPE_MONGOOSE ];


async function instance(option) {


  if (!option.hasOwnProperty('type') || DB_TYPES.indexOf(option.type) == -1) {
   throw Error ('DatabaseHelper: You must set a valid option.type for database type [mongodb/mysql]')
 }
 else if (!option.hasOwnProperty('params')) {
  throw Error ('DatabaseHelper: You must set a valid parameters for your database.');
}



    CONSOLE.DEFAULT('##> Creating new Database Helper \x1b[32m'+option.name+' \x1b[37m('+option.type+') on '+option.params.ip+':'+option.params.port+(option.params.base ? '/'+option.params.base : '')+' ...');

  /************ TYPE MONGO DB **************/

    if (option.type == DB_TYPE_MONGO) { 
      var database = await new require('./MongodbHelper.js')(option.name,option.params);
    }

  /************ TYPE MONGOOSE  **************/

    else if (option.type == DB_TYPE_MONGOOSE) { // IF TYPE MONGODB
      var database = await new (require('./MongooseHelper.js'))(option.name,option.params);
    }

    /************ TYPE MYSQL **************/

    else if (option.type == DB_TYPE_MYSQL) {

     if (!option.params.hasOwnProperty('login') || !option.params.hasOwnProperty('password')) {
      throw Error ('DatabaseHelper: You must set a "login" and "password" fields option');
    }
    else if (!option.params.hasOwnProperty('database')) {
      throw Error ('DatabaseHelper: You must set a database name or create it before');
    }
     var database = new require('./MysqlDbHelper.js')(option.name,option.params);
      }

    /******* RETURN */

    var status = await database.connect();
      CONSOLE.DEFAULT('##> Connection of Database Helper \x1b[32m'+option.name+'\x1b[37m : '+(status?'\x1b[32mSUCCESS':'\x1b[31mFAILED\x1b[37m on '+option.params.ip+':'+option.params.port+'. Please check: "\\_databases\\'+option.name+'.js" file parameters.'));
  
       if (status) return database;
       else {
          console.log("##  MongoDB must be installed on your system. ##")
          return false;
        }
    }




    module.exports = {instance}
