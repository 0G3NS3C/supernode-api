
const { CONSOLE } = require('../server/utils.js')
const fs = require('fs');
const structure = require('./_structure.js');
const path = require('path');
const { objectRecursive } = require('../injectors/modulesApi.js');
const CollectionsFactory = require('../collection/CollectionsFactory.js');


function removeInvalidsDirectories(arrayDirs) {
  return arrayDirs.filter((e) => (Object.values(structure.dir).indexOf(e+'/') === -1 && Object.values(structure.dir.security).indexOf(e+'/') === -1));
}

function removeInvalidsFiles(arrayDirs) {
  return arrayDirs.filter((e) => (Object.values(structure.file).indexOf(e) === -1));
}

function removeHiddensFiles(arrayDirs) {
  return arrayDirs.filter(e => !(/(^|\/)\.[^\/\.]/g).test(e));
}

module.exports = () => ({
  collections: [],
  scan: async function({ databases, directory, config }) { //DEVNOT : DONE FOR V2
    let collections_dirs = {};
    const directoryCollections = path.normalize(directory+structure.dir.collections);

    if (fs.existsSync(directoryCollections)) {
      collections_dirs = fs.readdirSync(directoryCollections);
      collections_dirs = removeInvalidsDirectories(collections_dirs);
      collections_dirs = removeInvalidsFiles(collections_dirs);
      collections_dirs = removeHiddensFiles(collections_dirs);
    }
    CONSOLE.DEFAULT('##> Collections files -> \x1b[32m' + collections_dirs.length + '\x1b[37m found(s)...')

    for(let dir in collections_dirs) {
      let name = collections_dirs[dir].toLowerCase();
      const collection = {
        name: name,
        path: path.normalize(directoryCollections + "/" + collections_dirs[dir]),
      }

      collection.directives = fs.readdirSync(path.normalize(collection.path));
      collection.directives = collection.directives.filter((e) => (Object.values(structure.collections).includes(e)))


      for (let file of collection.directives) {

        let pathFile = path.normalize(collection.path + "/" + file);

        // Si directive fichier
        if (Object.values(structure.collections).filter((e) => (e.search('.js') > -1)).indexOf(file) > -1) {
            // console.log(':: FILE :: '+ file.split('.')[0] + "::"+pathFile)
          collection[file.split('.')[0]] = require(pathFile);
        }

        // Sinon si directive dossier
        else if (Object.values(structure.collections).filter((e) => (e.search('.js') === -1)).indexOf(file) > -1) {
            // console.log(':: DIR :: '+ file.split('.')[0] + "::"+pathFile)
          if (!collection[file]) collection[file] = {};
          collection[file].path = pathFile;
          collection[file].list = [];
          for (let hit of fs.readdirSync(pathFile)) {
            collection[file].list.push({
              name: hit.replace('.js',''),
              path: path.normalize(pathFile + "/" + hit),
            })
          }
        }
      }
      //Creation de la config si inéxistante
      if (!collection.config) {
          collection.config = {}; 
          collection.config.router = false;
          collection.cache = 'dynamic';
          if (collection.schema) collection.config.database = 'default';
      }

      CONSOLE.DEFAULT('####- preparing collection ->  \x1b[32m'+collection.name+'\x1b[37m ...')
      this.collections[collection.name] = collection;
    }
    return this.collections;
  },

  inject: objectRecursive,

  build: async function({ context }) {
    let Collections = context.collections;
    let newCopy = null;
    for (let i in Collections) {
      let collection = Collections[i];
      newCopy = new CollectionsFactory.create(context.databases,
        {
          Collection: collection,
          Extends: collection.manager ? collection.manager : null,
          Class: collection.class ? collection.class : null,
          Schema: collection.schema ? collection.schema : null,
      });
      collection = newCopy;
    }
  },
})

