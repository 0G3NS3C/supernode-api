
const { CONSOLE } = require('../server/utils.js')
const fs = require('fs');
const path = require('path');
const structure = require('./_structure.js');
const _ = require('lodash');
const { objectRecursive } = require('../injectors/modulesApi.js');

module.exports = () => ({
	middlewares: [],
	scan: async function({ directory, collections }) { // DEV NOTE DONE FOR V2.
		let created = [], groupedmiddlewares = [], root_path, root_middlewares = [], collections_middlewares = [];
		root_path = path.normalize(directory+structure.dir.middlewares);
		root_middlewares = fs.existsSync(root_path) ? fs.readdirSync(root_path) : [];

		if (root_middlewares.length) root_middlewares = root_middlewares.map((e) => ({ 
			name: structure.default.middlewares,
			middlewares: {
				path: root_path,
				list: [{ name: e.replace('.js','').replace('root.', '').replace('middleware.',''), path: root_path + e}],
			}
		}));

		collections_middlewares = Object.values(collections).filter((e) => (e.middlewares && e.middlewares.list && e.middlewares.list.length)).map((e) => (_.pick(e,['name','middlewares'])));
		groupedmiddlewares = [...root_middlewares, ...collections_middlewares];
		CONSOLE.DEFAULT('##> Middlewares groups -> \x1b[32m'+(groupedmiddlewares.length)+'\x1b[37m found(s)...')

		for (let group of groupedmiddlewares) {
			let rootName = group.name;
			for (let middleware of group.middlewares.list) {
				if (!this.middlewares[rootName]) this.middlewares[rootName] = {};
				middleware.name = middleware.name.replace(group.name+".","").replace('.js', '').replace('middleware.','');
				this.middlewares[rootName][middleware.name] = require(middleware.path);
				CONSOLE.DEFAULT('####- preparing middleware -> \x1b[32m'+middleware.name+'\x1b[37m ...')
			}
		}	
		return this.middlewares;
	},

	inject: objectRecursive,

	build: function({ context }) {
		for (let i in context.collections) {
			let collection = context.collections[i];
			if (collection.middlewares) {
				var linkObject = {};
				for (let e in collection.middlewares.list) {
					let middleware = collection.middlewares.list[e];
					CONSOLE.DEFAULT('-----> Factoring : \x1b[32m'+(collection.name)+' -> '+(middleware.name)+'\x1b[37m');
					linkObject[middleware.name] = context.middlewares[collection.name][middleware.name]
				}
				collection.middlewares = linkObject;
			}
		}
	}
})




