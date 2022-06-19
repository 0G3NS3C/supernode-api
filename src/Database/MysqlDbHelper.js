
   var mysql = require('mysql');



 class MysqlDbHelper{


  constructor (server,login,password,database) {

    this.options = {
      host: server,
      user: login,
      password: password,
      database: database
    };



    this.select = this.select.bind(this);

    this._connect = this._connect.bind(this);
    this._send = this._send.bind(this);

  }

 _connect() {
  var connection = mysql.createConnection(this.options);
connection.on('error', function(err) {

    if(err.code === "PROTOCOL_CONNECTION_LOST"){    
        console.log("/!\\ Cannot establish a connection with the database. 1  /!\\ ("+err.code+")");
    }

    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
        console.log("/!\\ Cannot establish a connection with the database. 2 /!\\ ("+err.code+")");
    }

    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
        console.log("/!\\ Cannot establish a connection with the database. 3/!\\ ("+err.code+")");
    }

    else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
        console.log("/!\\ Cannot establish a connection with the database. 4/!\\ ("+err.code+")");
    }

    else{
        console.log("/!\\ Cannot establish a connection with the database. 5/!\\ ("+err.code+")");
    }

});

return connection;


 } 
 

  select(option) {
    // var field,from,where=null;

    // if (!option.hasOwnProperty('from')) {
    //   super.error('You must enter a "from" table name');
    // }

    // if(!option.hasOwnProperty('field')) {
    //   field = '*';
    // }

    // if (option.hasOwnProperty('where')) {
      
    // }
    return this._send(option);

  }



  _send(option) {
     var t = this,
        
        response = {data: null, error: null};

        return new Promise(function(resolve, reject) {
          var con = t._connect();
                 con.connect(function(err) {
          if (err) { response.error = new mysqlError(err) ; con.end(); reject(response.error);}
            else {
            con.query(option, function (err, result, fields) {
            if (err) { response.error = new mysqlError(err) ; con.end(); reject(response.error); }
            response.data = result;
            resolve(response);
          });
            }

        });
})
    

  
  }


}

module.exports = MysqlDbHelper;


class mysqlError {

  constructor(data) {



    this.code = data.code;
    this.msg = data.sqlMessage;
    console.log('Server: New MYSQL_ERROR ['+this.code+'] msg='+this.msg)
  }

  getMessage() { return this.msg }
  getCode() { return this.code }

  isNoSuchTable() {
    if (this.code == "ER_NO_SUCH_TABLE") { return true; }
    return false;
  }
 
}