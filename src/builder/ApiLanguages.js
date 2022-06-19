
const { CONSOLE } = require('../server/utils.js')
const structure = require('./_structure.js');
const fs = require('fs');
const path = require('path');
const { objectRecursive } = require('../injectors/modulesApi.js');

module.exports = () => ({

    memories: [],
    scan: function({ directory }) {
        CONSOLE.DEFAULT('##> Loading languages files...')
        let _pathlang = path.normalize(directory+structure.dir.langs);

        let files = fs.existsSync(_pathlang) ? fs.readdirSync(_pathlang) : null;

        if (!files) { CONSOLE.ERROR("####- Can't read languages directory : "+_pathlang) } 

        else {
            files.forEach((file) => { 
                let lang = file.replace('.json','');

                 try {

                    this.memories[lang] = JSON.parse(fs.readFileSync(_pathlang+'/'+file));
                    CONSOLE.DEFAULT('####- Lang \x1b[32m['+lang+']\x1b[37m : load \x1b[32msuccess');
                 }catch(e){
                    console.log(e);
                    CONSOLE.DEFAULT('####- Lang \x1b[32m['+lang+']\x1b[37m : parse load \x1b[31merror !!!');
                 }
            })
        }
        return this.memories;
    },

    inject:objectRecursive,
})

function prepareLanguage(default_lang,ctx) {
    return function(req,res,next) {
        var lang = req.headers["accept-language"] && req.headers["accept-language"] !== 'undefined' ? req.headers["accept-language"].split(',')[0] : default_lang;
        ctx.text = function(index) {
        index = index.split('.') || index;
        let value= TextMemory[lang];
        if (typeof(index) === "object") {
            for(let i in index) {
                value = value[index[i]];
            }   
        }
        return value || index;
        }
        next();
    }
}

// router.use(prepareLanguage(config.lang,ctx));
