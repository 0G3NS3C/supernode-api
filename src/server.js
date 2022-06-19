const VERSION = "v1.0.2";

let prepare = require('./server/prepare.js');
let build = require('./server/build.js');
let start = require('./server/start.js');


module.exports = {
    version: VERSION,
    prepare: async () => ( await prepare({ VERSION }) ),
    build: async ({ API }) => ( await build({ API }) ),
    start: async ({ API, http }) => ( await start({ http, API }) ),
}
