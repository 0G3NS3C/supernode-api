const {v4: uuidv4} = require('uuid');
const {CONSOLE} = require('../server/utils.js');

class SocketCloud {
    constructor(ws, req, controllers) {
        console.log('new socket cloud');
        this.ws = ws;
        this.id = uuidv4();
  
        this.ws.on('message', function(message) {
            try {
                message = JSON.parse(message);
            } catch (e) {
                return
            }
            if (!message.type) return false;
            CONSOLE.DEFAULT('##> Socket [' + socket.id + '] IN -> \x1b[32m ' + message.type + ' \x1b[37m');
            if (controllers[message.type]) controllers[message.type](this.ws, req, message.data);
        })
    }

}


module.exports = SocketCloud;
