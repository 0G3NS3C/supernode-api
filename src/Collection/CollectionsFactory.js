const uuid = require('uuid');
const path = require('path');
let { CONSOLE } = require('../server/utils.js')

const CollectionManager = require('./CollectionManager.js');
const CollectionClass = require('./CollectionClass.js');

function create(databases, { Collection, Schema, Class, Extends }) {
    CONSOLE.DEFAULT('-----> Factoring : \x1b[32m'+(Collection.name)+'\x1b[37m');

            
    let ClassDatabase = Collection.config.database ? databases[Collection.config.database] : null;
    if (Class) {
        for (let i in Class.list) {
            let path = Class.list[i].path;
            let file = Class.list[i].name;
            Class = require(path);
            Collection.class = Class;
        }
    }
    var newManager = new CollectionManager({
        name: Collection.name,
        database: ClassDatabase,
        object: Class,
        schema: Schema,
        config: Collection.config,
    });

    if (Extends) {
        for (let i in Extends.list) {
            let extension = require(Extends.list[i].path)
            Extends.list[i].name = Extends.list[i].name.replace(Collection.name+'.', '');
            Extends.list[i].name = Extends.list[i].name.replace('manager.','');
            if (typeof(extension) === 'function') {
                newManager[Extends.list[i].name] = extension(newManager);
            } else {
                newManager[Extends.list[i].name] = extension;
            }
        }
    }
    Collection.manager = newManager;
   	return Collection;
}



    module.exports = {create}
