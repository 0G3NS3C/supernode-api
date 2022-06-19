
const { CONSOLE } = require('../server/utils.js')
const fs = require("fs"); // Or `import fs from "fs";` with ESM
const path = require('path');
const structure = require('./_structure.js');
const { arrayPush } = require('../injectors/modulesApi.js');

module.exports = () => ({

	scan: ({ directory , services , env }) => { // DEV NOT OK VOR V2.
		// Instance des variables
		let array = [];
			FileBootstrap = directory + structure.file.bootstrap;
			FileBootstrap =  fs.existsSync(FileBootstrap) ? require(FileBootstrap) : false;

			if (FileBootstrap) {
				CONSOLE.DEFAULT('####- preparing bootstrap ->  \x1b[32m'+directory + structure.file.bootstrap+'\x1b[37m ...')
				array.push(FileBootstrap);
			}

			return array
	},

	inject: arrayPush,

	build: ({ context }) => {
		context.bootstrap.forEach( async (func, x) => {
			CONSOLE.DEFAULT('-----> booting bootstrap : ' + (x+1));
			await func({ node: context });
		})
	}
})



