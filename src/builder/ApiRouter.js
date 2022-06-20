

const fs = require('fs');
const { CONSOLE } = require('../server/utils.js')
const structure = require('./_structure.js');
const path = require('path');
const { pick } = require('lodash');
const { customRouterRecursive, arrayIndexing } = require('../injectors/modulesApi.js');

const { capitalizeFirstLetter } = require('../server/utils.js');

let default_entrypoints = {
	collections: {
		get: 'collection_get.js',
		create: 'collection_create.js',
		update: 'collection_update.js',
		delete: 'collection_delete.js',
	}
}



module.exports = () => ({
	routes: [],
	scan: async function({ directory, collections }) {

		//verifier les fichier dans root router.js et fichier .config.js > defaultRouter
		//a faire ^
		let created = [], groupedRouters = [], root_path, root_router = [], collections_routers = [];
		root_path = path.normalize(directory+structure.file.router);
		root_router = fs.existsSync(root_path) ? require(root_path) : [];
		if (root_router.length) root_router = [{
			name: 'root',
			router: root_router,
		}]
		collections_routers = Object.values(collections).filter((e) => (e.router && e.router.length)).map((e) => (pick(e,['name','router'])));
		groupedRouters = [...root_router, ...collections_routers];

		CONSOLE.DEFAULT('##> routers files -> \x1b[32m'+(groupedRouters.length)+'\x1b[37m found(s)...')
		this.routes = groupedRouters;
		return this.routes;
	},

	inject: arrayIndexing,


	async build({ app, express, context }) {

		var RootRouter = express.Router();

		RootRouter.use(_call.middleware(context.middlewares.root.prepareHeader.name, context.middlewares.root.prepareHeader, {  }));
		RootRouter.use(_call.middleware(context.middlewares.root.optionsCORS.name, context.middlewares.root.optionsCORS, {  }));
		RootRouter.use(_call.middleware(context.middlewares.root.prepareRequest.name, context.middlewares.root.prepareRequest, {  }));

		app.use(RootRouter);

		//> Build Root Router
		let routerOfRoot =  context.router.find((e) => (e.name === 'root'));
		if (routerOfRoot && routerOfRoot.router) {
			for (let route of routerOfRoot.router) {
				CONSOLE.DEFAULT('-----> Factoring Root : \x1b[32m' + (route.path) + '\x1b[37m');
				RootRouter.use(
					route.path,
					_call.middleware(
						context.middlewares.root.checkAccess.name,
						context.middlewares.root.checkAccess,
						{route},
					)
				)
				if (route.middlewares) {
					for (let middleware of route.middlewares) {
						middlewareArray = middleware.split('.');
						if (context.middlewares[middlewareArray[0]][middlewareArray[1] || null]) {
							RootRouter.use(
								route.path,
								_call.middleware(
									middleware,
									context.middlewares[middlewareArray[0]][middlewareArray[1] || null],
									{route}
								)
							)
						} else {
							CONSOLE.WARNING('WARNING !! Missing root middlewares : ' + middleware + ' in ' + route.name);
						}
					}
				}
				if (!context.controllers[route.controller]) CONSOLE.WARNING('WARNING !! Missing controllers : ' + route.controller + ' in ' + route.name);
				else RootRouter[route.method.toLowerCase()](route.path, _call.controllers(route.controller, context.controllers[route.controller], {route}));
			}
		}
		//RootRouter.use('/', ChildRootRouter);
		//> Building Collections Router
		for (let CollectionName in context.collections) {
			let Collection = context.collections[CollectionName];
			if (Collection.router) {
				const CollectionRouter = express.Router();
				let RoutePath = '/'+CollectionName;
				RootRouter.use(RoutePath, CollectionRouter);
				for (let route of Collection.router) {
					CONSOLE.DEFAULT('-----> Factoring : \x1b[32m'+(CollectionName)+(route.path)+'\x1b[37m');
					CollectionRouter.use(
						route.path,
						_call.middleware(
							context.middlewares.root.checkAccess.name,
							context.middlewares.root.checkAccess,
							{ route },
						)
					)
					if (route.middlewares) {
						for (let middleware of route.middlewares) {
							if (context.middlewares[CollectionName] && context.middlewares[CollectionName][middleware]) {
								CollectionRouter.use(
									route.path,
									_call.middleware(
										CollectionName + '->' + middleware,
										context.middlewares[CollectionName][middleware],
										{route},
									),
	
								)
							}
							else {
								let middlewareNameSplitted = middleware.split('.');
								if (middlewareNameSplitted.length > 1) {
									const collection = middlewareNameSplitted[0];
									const middleware = middlewareNameSplitted[1];
									CollectionRouter.use(
										route.path,
										_call.middleware(
											collection + '->' + middleware,
											context.middlewares[collection][middleware],
											{route }
										),

									)
								}
								else CONSOLE.WARNING('WARNING !! Missing middlewares : '+ middleware +' in '+ route.name);
							}
						}
					}

					if (!context.controllers[route.controller]) CONSOLE.ERROR('Missing controllers : '+ route.controller +' in '+ route.name);
					else CollectionRouter[route.method.toLowerCase()](route.path,_call.controllers(route.controller, context.controllers[route.controller], { route }));
				}
			}
		}
	}
})

function bindContext(req,res,next,route) {
	req.route = route;
	let ctx = { req,res,next } // /!\ Experimental, with / without object.assign for copy
	return ctx;
}

var _call = {
	middleware: function(name, func, { route= null }) {
		return function(req,res,next) {
			CONSOLE.MSG('Calling middleware : \x1b[32m'+name+'\x1b[30m -> ['+req.hostname+']')
			ctx = bindContext(req,res,next,route);
			// console.log(ctx);
			return func(ctx);
		}
	},

	controllers: function(name,func,{ route = null })  {
		return async function(req,res,next) {
			CONSOLE.MSG('Calling controller : \x1b[32m'+name+'\x1b[30m -> ['+req.hostname+']')
		 	console.log('');
		 	console.log('');
			let ctx=bindContext(req,res,next, route );
			return await func(ctx);
		}
	}
}

