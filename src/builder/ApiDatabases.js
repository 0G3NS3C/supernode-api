

const fs = require('fs');
const structure = require('./_structure.js');
const { CONSOLE } = require('../server/utils.js')
const DatabasesManager = require('../database/DatabasesManager.js');
const { arrayIndexing } = require('../injectors/modulesApi.js');

module.exports = () => ({
			databases: [],
			scan: async function({ directory, config }) {
				let files = fs.existsSync(directory+structure.dir.databases) ? fs.readdirSync(directory+structure.dir.databases) : [];

					CONSOLE.DEFAULT('##> Databases files -> \x1b[32m'+(files.length)+'\x1b[37m found(s)...')
					for (let file in files) {
							file = files[file];
							var name = file.replace('.js','');
							var database = require(directory+structure.dir.databases+file);
							database.name = name;
							var db = await DatabasesManager.instance(database);
							this.databases[name] = db;
							if (config && name === config.database) { this.databases.$default = database }
					}

				return this.databases;
			},

			inject: arrayIndexing,
		})



