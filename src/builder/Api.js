let {CONSOLE, PERFORMANCE} = require('../server/utils.js')
const structure = require('./_structure.js');
const path = require('path');

/***********************************************************************
 *
 * Global API class
 *
 **/

module.exports = function ({name, api_directory, env}) {

    let _modulesDependencies = [ //Dont disorder this list !
        {index: 'config', mod: new require('./ApiConfig.js')()},
        {index: 'databases', mod: new require('./ApiDatabases.js')()},
        {index: 'collections', mod: new require('./ApiCollections.js')()},
        {index: 'services', mod: new require('./ApiServices.js')()},
        {index: 'security', mod: new require('./ApiSecurity.js')()},
        {index: 'languages', mod: new require('./ApiLanguages.js')()},
        {index: 'controllers', mod: new require('./ApiControllers.js')()},
        {index: 'middlewares', mod: new require('./ApiMiddlewares.js')()},
        {index: 'router', mod: new require('./ApiRouter.js')()},
        {index: 'sockets', mod: new require('./ApiSockets.js')()},
        {index: 'bootstrap', mod: new require('./ApiBootstrap.js')()},
    ];

    this.context = {};
    this.prepared = false;
    this.environement = env;
    this._module = function (index = null) {
        let a = Object.keys(this.context).find((e) => (e === index));
        return a ? this.context[a] : this.context;
    }
    this._dependencies = (index = null) => (index ? _modulesDependencies.find((e) => (e.index === index)) : _modulesDependencies);

    this.getContext = function () {
        return this.context;
    }
    this.prepare = async function () {
        let t0 = PERFORMANCE();
        CONSOLE.DEFAULT('                                             ')
        CONSOLE.DEFAULT('------------> Scanning API \x1b[32m' + (name || 'Base System Layer') + '\x1b[37m <------------');
        for (let i in _modulesDependencies) {
            var {index, mod} = _modulesDependencies[i];
            CONSOLE.DEFAULT('#> Scanning module ' + index + ' ...');
            this.context[index] = mod['scan'] ? await mod.scan({
                directory: api_directory,
                config: this.context.config || null,
                databases: this.context.databases || null,
                services: this.context.services || null,
                collections: this.context.collections || null,
                sockets: this.context.sockets || null,
                env: env,
            }) : null;
        }
        // console.log(context);
        CONSOLE.DEFAULT('>-------------------( ' + (PERFORMANCE(t0)) + ' ms )-----------------------<');
        this.prepared = true;
    }

    this.inject = function (child) {
        let t0 = PERFORMANCE();
        CONSOLE.DEFAULT('                                             ')
        CONSOLE.DEFAULT('-> Starting API LAYERS Merging...');
        child._dependencies().forEach((module) => {
            let name = module.index;
            if (this._dependencies(name).mod['inject']) {
                this._dependencies(name).mod.inject(this.context[name], child._module(name)) || null;
            } else this.context[name] = null;
        })
        // console.log(context);
        CONSOLE.DEFAULT('-> End API MERGE ( ' + (PERFORMANCE(t0)) + ' ms )');
    }


    this.build = async function ({app, express}) {
        let t0 = PERFORMANCE();
        CONSOLE.DEFAULT('                                             ')
        CONSOLE.DEFAULT('-> Engaging API Building...');
        await this._dependencies().forEach(async (module) => {
            let name = module.index;
            if (this._dependencies(name).mod['build']) {
                CONSOLE.DEFAULT('----> building module :\x1b[32m ' + name + '\x1b[37m');
                await this._dependencies(name).mod.build({
                    app,
                    express,
                    context: this.context,
                    env: this.environement
                });
            }
            // : CONSOLE.DEFAULT('Missing : dependencies build function for '+name+' API module'));
        })
        CONSOLE.DEFAULT('-> End API BUILD ( ' + (PERFORMANCE(t0)) + ' ms )');
        return true;

    }

    this.start = function () {
        let t0 = PERFORMANCE();
        CONSOLE.DEFAULT('-> Starting API...');
        CONSOLE.DEFAULT('-> API STARTED ! ( ' + (PERFORMANCE(t0)) + ' ms )');
        return true;
    }
}
