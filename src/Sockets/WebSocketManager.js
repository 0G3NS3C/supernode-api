

const {v4: uuidv4} = require('uuid');
const {CONSOLE} = require('../server/utils.js');
//const SocketCloud = require('./SocketCloud.js');

let RAM_SOCKETID = {};
let RAM_PROFILEID = {};
let RAM_ROOMS = {};
///------

const CONTROLLERS = [];

const WebSocketManager = {

    async build(WSSERVER, sockets) {

        sockets.server.controllers.forEach(async (controller) => {
            CONTROLLERS[controller.name] = await require(controller.path);
        })

        WSSERVER.on('connection', function connection(socket, req) {

            socket.id = uuidv4();
            RAM_SOCKETID[socket.id] = socket;

            socket.rooms = [];
            socket.isAuth = () => {
                return WebSocketManager._isAuth(socket);
            }
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
                WebSocketManager._joinRoom(socket, room);
            }
            socket.leave = (room = null) => {
                WebSocketManager._leaveRoom(socket, room)
            }

            socket.isIn = (room) => {
                return WebSocketManager._isIn(socket, room);
            }

            socket.broadcast = (room, message, callback = null) => {
                const broadcastedUntilOrigin = WebSocketManager._broadcast(socket, room, message);
                if (callback) callback(broadcastedUntilOrigin);
                else return broadcastedUntilOrigin;
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
                    WebSocketManager._broadcastDisconnect(socket);
                    WebSocketManager._unregisterSocket(socket);
                    CONSOLE.DEFAULT('##> SOCKET Closed. Total : -> \x1b[32m' + Object.keys(RAM_SOCKETID).length + ' \x1b[37m')
                })

        })

        return this;
        // WSSERVER.on('connection', function connection(socket, req) {
        //     const Socket = new SocketCloud(socket);
        //     if (!socket.id) {
        //         socket.id = uuidv4();
        //         RAM_SOCKETID[socket.id] = socket;
        //         CONSOLE.DEFAULT('##> SOCKET Connexion.  Total : -> \x1b[32m' + Object.keys(RAM_SOCKETID).length + ' \x1b[37m')
        //     }

        //         if (server.config.access > 0) {
        //             req.url = req.url.replace('/?', '');
        //             const params = new URLSearchParams(req.url);
        //             if (!params.xdevice || !params.xsession) _this.disconnectSocket(socket);
        //         }

        //         prepareSocketFunctions(socket);

        //         socket.on('message', function (message) {
        //             try {
        //                 message = JSON.parse(message);
        //             } catch (e) {
        //                 return
        //             }
        //             if (!message.type) return false;
        //             if (message.auth) socket.auth = message.auth;
        //             CONSOLE.DEFAULT('##> Socket [' + socket.id + '] IN -> \x1b[32m ' + message.type + ' \x1b[37m');
        //             if (server[message.type]) server[message.type](socket, req, message.data);
        //         })

        //         socket.on('close', function (close) {
        //             _this._broadcastDisconnect(socket);
        //             _this._unregisterSocket(socket);
        //             CONSOLE.DEFAULT('##> SOCKET Closed. Total : -> \x1b[32m' + Object.keys(RAM_SOCKETID).length + ' \x1b[37m')
        //         })
        //     })
    },

        _registerSocket(socket, auth) {
        RAM_PROFILEID[auth.profileKey] = socket;
    },
    _cleanSocket(auth) {
        let socket = RAM_PROFILEID[auth.profileKey] || null;
        if (socket) {
            this._unregisterSocket(socket);
            socket.close();
            if (RAM_SOCKETID[auth.socketId]) delete RAM_SOCKETID[auth.socketId];
        }
    },
    _unregisterSocket(socket) {
        for (let key in RAM_ROOMS) {
            RAM_ROOMS[key] = RAM_ROOMS[key].filter((e) => (e.id !== socket.id))
        }
        delete RAM_SOCKETID[socket.id];
        if (socket.auth) delete RAM_PROFILEID[socket.auth.profileKey];
        if (socket.profile) delete RAM_PROFILEID[socket.profile.getKey()];

    },
    _broadcastDisconnect(socket) {
        for (let room in socket.rooms) {
            console.log('BROAD DISCONNECT IN '+socket.rooms[room]);
            this._broadcast(socket, socket.rooms[room],
                {
                    type: 'userStatus',
                    data: {
                        flux: socket.rooms[room],
                        profile: socket.profile.getKey(),
                        status: false,
                    }
                });
        }
    },
    _isAuth(socket) {
        if (!socket.auth) return false;
        const X_AUTH = OGS.$Security.tokens['socket-auth'];
        let authDecoded = OGS.$Services.crypter.JWT.DECODE(OGS.$Security.tokens[X_AUTH.header].key, socket.auth);
        if (!authDecoded) return false;
        if (authDecoded.socketId !== socket.id) return false;
        return true;
    }
    ,
    _joinRoom(socket, room) {
        if (!room || socket.rooms.includes(room)) return;
        socket.rooms.push(room);
        console.log(socket.rooms);
        if (!RAM_ROOMS[room]) RAM_ROOMS[room] = [];
        RAM_ROOMS[room].push(socket);
    }
    ,
    _leaveRoom(socket, room) {
        if (!room || !socket.rooms.includes(room)) return;
        socket.rooms = socket.rooms.filter((e) => e !== room);
        RAM_ROOMS[room] = RAM_ROOMS[room].filter((s) => (s.id !== socket.id));
    }
    ,

    _isIn(socket, room) {
        if (RAM_ROOMS[room]) {
            for (let client of RAM_ROOMS[room]) {
                if (client.id === socket.id) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    ,

    _isOnlineProfile(profileKey) {
        if (RAM_PROFILEID[profileKey]) return true;
        else return false;
    }
    ,
    _getByProfile(profile) {
        if (RAM_PROFILEID[profile.getKey()]) {
            return RAM_PROFILEID[profile.getKey()]
        }
        return false;
    }
    ,
    _broadcast(socket = null, room, data) {
        if (RAM_ROOMS[room]) {
            CONSOLE.DEFAULT('##> Broadcast ' + socket ? socket.id : 'all' + '] OUT -> \x1b[32m ' + room + ' \x1b[37m');
            if (!RAM_ROOMS[room].length || RAM_ROOMS[room].length === 1) {
                return false;
            }
            for (let client of RAM_ROOMS[room]) {
                if (socket) {
                    if (client.id !== socket.id) {
                        client._send(data)
                    }
                } else {
                    client._send(data)
                }
            }
            return true;
        } else {
            return false
        }
    }
}
module.exports = WebSocketManager;
