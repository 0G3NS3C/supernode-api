const {CONSOLE} = require('../server/utils.js')
const fs = require("fs"); // Or `import fs from "fs";` with ESM
const path = require('path');
const structure = require('./_structure.js');
const default_security_dir = path.normalize(__dirname + "/../api/" + structure.security.default);
const {objectRecursive} = require('../injectors/modulesApi.js');
const SocketsServerFactory = require('../sockets/SocketsServerFactory');

module.exports = () => ({
    scan: ({directory, services, env}) => { // DEV NOT OK VOR V2.
        // Instance des variables
        let sockets = {
                config: null,
                server: {
                    controllers: [],
                }
            },
            socketsDirectory = path.normalize(directory + structure.dir.sockets),
            socketsFiles = fs.existsSync(socketsDirectory) ? fs.readdirSync(socketsDirectory) : [];

        socketsFiles.forEach((file) => {
            let serverDirectory = path.normalize(directory + structure.dir.sockets + file + "/");
            if (file === structure.sockets.config) {
                sockets.config = require(serverDirectory);
            }
            else if (file === structure.sockets.controllers) {
   
                let controllers = fs.existsSync(serverDirectory)
                    ? fs.readdirSync(serverDirectory)
                    : []

                controllers.forEach((func) => {
                    let name = func.replace('.js', '').replace('socket.', '');
                    sockets.server.controllers.push({
                        name: name,
                        path: path.normalize(serverDirectory + '/'+ func)
                    })
                })
            }
        })
        CONSOLE.DEFAULT('##> Sockets -> \x1b[32m' + (sockets.server.controllers.length) + ' \x1b[37m controllers found(s)...');
        return sockets;
    },

    inject: objectRecursive,
    build: async ({context, env}) => {
        //DEV NOTE : Envoyer le context au socketserverfactory pour créer variable ogs;
        let socketBuilded = await SocketsServerFactory.build(context.sockets, context.config.ssl);
        CONSOLE.DEFAULT('##> Sockets listening on port -> \x1b[32m' + (context.sockets.config.port) + ' \x1b[37m')
        node.sockets = socketBuilded;
    }
})



