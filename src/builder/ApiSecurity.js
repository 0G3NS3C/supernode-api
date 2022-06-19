
const { CONSOLE } = require('../server/utils.js')
const fs = require("fs"); // Or `import fs from "fs";` with ESM
const path = require('path');
const structure = require('./_structure.js');
const default_security_dir = path.normalize(__dirname+"/../api/"+structure.security.default);
const { objectRecursive } = require('../injectors/modulesApi.js');
const prefixToken = "tokens::";

module.exports = () => ({
	scan: ({ directory , services , env }) => { // DEV NOT OK VOR V2.
		// Instance des variables
		let object = { tokens: {} },
			DirectoryModules = [],
			DirectorySecurity = directory + structure.dir.security;
			DirectoryModules =  fs.existsSync(DirectorySecurity) ? fs.readdirSync(DirectorySecurity) : [];
			let Environement = env.get('security');
			if (!Environement) Environement = {};
			if (!Environement.tokens) Environement.tokens = {};
		// Scan du dossier /tokens if exists
		if (DirectoryModules.indexOf(structure.security.tokens.substring(0, structure.security.tokens.length - 1)) > -1) {
			let TokensDirectory = fs.readdirSync(DirectorySecurity+structure.security.tokens);
			TokensDirectory.forEach(async (file) => {
				let func = require(DirectorySecurity+structure.security.tokens+file);
				let name = file.replace('.js','');
				let Token = func(services);
				if (Token.system && !Environement.tokens[name]) {
					if (!Token.options.key) {
						CONSOLE.WARNING(`WARNING ! System security token '${name}' has never been declared. It\'ll be generated now.`);
						CONSOLE.WARNING(`WARNING ! If it's not the first installation, some previous data using this token may be corrupted.`);
						Token.options.key = await Token.create();
					}
					Token.options.header = Token.header || null;
				}
				else {
					Token.options = Environement.tokens[name];

				}
				object.tokens[name] = Token.options
			})
		}
		return object;
	},

	inject: objectRecursive,
	build: ({ context, env }) => {
		env.set('security', context.security);
	}
})



