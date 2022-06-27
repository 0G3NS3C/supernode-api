

const {v4: uuidv4} = require('uuid');
const {CONSOLE} = require('../server/utils.js');
//const SocketCloud = require('./SocketCloud.js');

let RAM_SOCKETID = {};
let RAM_INDEXES = {};
let RAM_ROOMS = {};
///------

const CONTROLLERS = [];

const WebSocketManager = {

    async build(WSSERVER, sockets) {
        let _this = this;

        this.getInRoom = function(room) {
                let clients = [];
                WSSERVER.clients.forEach((client) => {
                    if (client.rooms.includes(room)) {
                        clients.push(client);
                    }
                })
                return clients;
        }
        
        sockets.server.controllers.forEach(async (controller) => {
            CONTROLLERS[controller.name] = await require(controller.path);
        })

        WSSERVER.on('connection', function connection(socket, req) {

            CONSOLE.DEFAULT('##> SOCKET Connected. Total : -> \x1b[32m' + WSSERVER.clients.size + ' \x1b[37m')
            socket.id = uuidv4();
            socket.rooms = [];
            socket._send = (data) => {
                CONSOLE.DEFAULT('##> Socket [' + socket.id + '] OUT -> \x1b[32m ' + data.type + ' \x1b[37m');
                try {
                    data = JSON.stringify(data);
                } catch (e) {

                }
                console.log(data);
                socket.send(data)
            }

            //Socket Rooms

            socket.join = (room = null) => {
                if (!socket.rooms.includes(room)) {
                    socket.rooms.push(room);
                }
            }
            socket.leave = (room = null) => {
                socket.rooms = socket.rooms.filter((r) => (r !== room));
            }

            socket.isIn = (room) => {
                return socket.rooms.includes(room);
            }

            socket.broadcast = (room, data, callback = null) => {
                let broadcasted = 0;
                WSSERVER.clients.forEach((client) => {
                    if (client.auth && client.rooms.includes(room) && client.id !== socket.id) {
                        client._send(data);
                        broadcasted++;
                    }
                })
                if (callback) callback(broadcasted);
            }
            socket.on('message', function(message) {
                try {
                    message = JSON.parse(message);
                } catch (e) {
                    return
                }
                if (!message.type) return false;
                CONSOLE.DEFAULT('##> Socket [' + socket.id + '] IN -> \x1b[32m ' + message.type + ' \x1b[37m');
                if (CONTROLLERS[message.type]) CONTROLLERS[message.type](socket, req, message.data);
            })

            socket.on('close', function (close) {
                for (let room of socket.rooms) {
                    socket.broadcast(room, {
                        type: 'userStatus',
                        data: {
                            flux: room,
                            profile: socket.auth.profileKey,
                            status: false,
                        }
                    })
                }
                WebSocketManager.unregisterSocket(socket);
                CONSOLE.DEFAULT('##> SOCKET Closed. Total : -> \x1b[32m' + WSSERVER.clients.size + ' \x1b[37m')
            })

        })

        return this;
    },
    registerSocket(socket, auth) {
        for (let e in auth) {
            if (!RAM_INDEXES[e]) RAM_INDEXES[e] = {};
            RAM_INDEXES[e][auth[e]] = socket;
        }
        socket.auth = auth;
       // CONSOLE.DEFAULT('##> SOCKET AUTH. Total : -> \x1b[32m' + Object.keys(RAM_SOCKETID).length + ' \x1b[37m')
    },

    unregisterSocket(socket) {
        for (let e in socket.auth) {
            if (RAM_INDEXES[e] && RAM_INDEXES[e][socket.auth[e]]) delete RAM_INDEXES[e][socket.auth[e]];
        }
        socket.close();
    },

    getByIndex(index, key) {
        if (RAM_INDEXES[index] && RAM_INDEXES[index][key]) return RAM_INDEXES[index][key];
        else return false;
    },

    cleanFromRooms(socket) {
        for (let room in RAM_ROOMS) {
            RAM_ROOMS[room] = RAM_ROOMS[room].filter((s) => (s.id !== socket.id));
        }
    },


}
module.exports = WebSocketManager;
