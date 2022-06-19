
const { CONSOLE } = require('../server/utils.js')
const fs = require('fs');
const path = require('path');
const structure = require('./_structure.js');
const _ = require('lodash');
const { arrayIndexing } = require('../injectors/modulesApi.js');

var services = [];

 var ApiService = () => ({

 	scan: async function({ directory, collections }) { // DEV NOTE DONE FOR V2.
 		let rootServices, rootServicesPath, collectionsServices, collectionsServicesPath, groupedServices;

		rootServicesPath = path.normalize(directory+structure.dir.services);
		rootServices = fs.existsSync(rootServicesPath) ? fs.readdirSync(rootServicesPath) : false;

		let newRootServices = []
		if (rootServices && rootServices.length) {
			let newObject = {
				name: 'root',
				services: {
					path: rootServicesPath,
					list: [],
				}
			}
			rootServices.forEach((e) => {
				let rootServiceName = e.toLowerCase().replace('.js','');
				let rootServicePath = path.normalize(rootServicesPath + "/" + e);
				newObject.services.list.push({
					name: rootServiceName.toLowerCase(),
					path: rootServicePath,
				})

			})
			newRootServices.push(newObject);
			rootServices = newRootServices;
		}

		collectionsServices = Object.values(collections).filter((e) => (e.services && e.services.list && e.services.list.length)).map((e) => (_.pick(e,['name','services'])));

		if (rootServices) groupedServices = [...rootServices, ...collectionsServices];
		else groupedServices = collectionsServices;

		CONSOLE.DEFAULT('##> Services groups -> \x1b[32m'+(groupedServices.length)+'\x1b[37m found(s)...')
		for (let group of groupedServices) {
			let groupServicesName = group.name;
			let groupServices = group.services.list;

			for (let service of groupServices) {
				service.name = service.name.replace(groupServicesName+".",'').replace('service.','');
				CONSOLE.DEFAULT('####- preparing service ->  \x1b[32m'+groupServicesName + '.' + service.name+'\x1b[37m ...')
				if (groupServicesName === 'root') {
					services[service.name] = require(service.path);
				}
				else {
					if (!services[groupServicesName]) services[groupServicesName] = {};
					services[groupServicesName][service.name] = require(service.path);	
				}
			}
		}
		return services;
 	},
 	inject: arrayIndexing,
 	build: function({ context }) {

		 for (let j in context.services) {
		 	if (typeof(context.services[j]) === 'function') context.services[j] = context.services[j]({ node: context });
		 }
 		for (let i in context.collections) {
 				let newServices = {};
				let Collection = context.collections[i];
				if (Collection.services && Collection.services.list.length) {
					for (let s in Collection.services.list) {
						let service = Collection.services.list[s];
						CONSOLE.DEFAULT('-----> Factoring : \x1b[32m'+(Collection.name)+' -> '+(service.name)+'\x1b[37m');
						if (context.services[Collection.name][service.name]) newServices[service.name] = context.services[Collection.name][service.name];
						context.services[Collection.name][service.name] = newServices[service.name];
					}
				}
				Collection.services = newServices;
 		}

 	}
})



module.exports = ApiService



