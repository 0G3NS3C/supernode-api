const {createServer: createServerHTTPS} = require('https');
const {createServer: createServerHTTP} = require('http');
const WebSocketManager = require('./WebSocketManager');
const {readFileSync} = require('fs');
const {WebSocketServer} = require('ws');

const {CONSOLE} = require('../server/utils.js')


let WSSERVER = null;

const SocketsServerFactory = {

    async build(sockets, SSL) {
        let server;
        /* Handle SSL or not */
        if (SSL) {
            server = createServerHTTPS({
                cert: SSL.cert,
                key: SSL.key
            })
        } else {
            server = createServerHTTP();
        }

        /* Lauching server */

        for (let option of Object.keys(sockets.config.options)) {
            server[option] = sockets.config.options[option]
        }
        console.log(server);
        WSSERVER = new WebSocketServer({server});
        const SocketManager = await WebSocketManager.build(WSSERVER, sockets);
        server.listen(sockets.config.port);
        return SocketManager;
    },
}

module.exports = SocketsServerFactory;
