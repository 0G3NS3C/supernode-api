
const { CONSOLE } = require('../server/utils.js')
const fs = require('fs');
const path = require('path');
const structure = require('./_structure.js');
const _ = require('lodash');
const { arrayIndexing } = require('../injectors/modulesApi.js');

var controllers = [];

module.exports = () => ({

	scan: async function({ directory, collections }) {
		let created = [], groupedControllers = [], rootControllersPath, rootControllers = [], collectionsControllers = [];
		rootControllersPath = path.normalize(directory+structure.dir.controllers);
		rootControllers = fs.existsSync(rootControllersPath) ? fs.readdirSync(rootControllersPath) : [];
		// /!\ faire combinaison des controllers default et existant
		if (rootControllers) {
			let newRootControllers = [];
			rootControllers.forEach((e) => {
				let newObject = {
					name: e.toLowerCase(),
					controllers: {
						path: null,
						list: [],
					}
				};
				let pathController = path.normalize(rootControllersPath + "/" + e);
				newObject.controllers.path = pathController;
				let controllersList = fs.existsSync(pathController) ? fs.readdirSync(pathController) : false;
				if (controllersList) {
					for(let file of controllersList) {
						let fileName = file.replace('.js','').toLowerCase();
						newObject.controllers.list.push({
							name: fileName,
							path: path.normalize(pathController+"/"+file),
						})
					}
				} else {
					newObject = null;
				}
				if (newObject) {
					newRootControllers.push(newObject);
				}
			}) 
			rootControllers = newRootControllers;
		}

		collectionsControllers = Object.values(collections).filter((e) => (e.controllers && e.controllers.list && e.controllers.list.length)).map((e) => (_.pick(e,['name','controllers'])));

		groupedControllers = [...rootControllers, ...collectionsControllers];

		CONSOLE.DEFAULT('##> Controllers groups -> \x1b[32m'+(groupedControllers.length)+'\x1b[37m found(s)...')

		for (let group of groupedControllers) {
			let rootName = group.name;
			for (let controller of group.controllers.list) {
				controller.name = controller.name.replace('controller.','');
				controller.name = controller.name.replace(rootName+'.', '');
				let index = rootName + "." + controller.name;
				controllers[index] = require(controller.path);
				CONSOLE.DEFAULT('####- preparing controller -> \x1b[32m'+index+'\x1b[37m ...')
			}
		}	
		return controllers;
	},

	inject: arrayIndexing,

	build: function({ context }) {
		for (let i in context.collections) {
			let collection = context.collections[i];
			if (collection.controllers) {
				var linkObject = {};
				for (let e in collection.controllers.list) {
					let controller = collection.controllers.list[e];
					CONSOLE.DEFAULT('-----> Factoring : \x1b[32m'+(collection.name)+' -> '+(controller.name)+'\x1b[37m');
					linkObject[controller.name] = context.controllers[collection.name+'.'+controller.name]
				}
				collection.controllers = linkObject;
			}
		}
	}
})



