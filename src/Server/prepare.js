
const _dirname = __dirname;
let inquirer = require('inquirer');
let path = require('path');
let { CONSOLE } = require('./utils.js')
let structure = require('../builder/_structure.js')


module.exports = async function({ VERSION }) {
        CONSOLE.DEFAULT('##################################################')
        CONSOLE.DEFAULT('#                                                #');
        CONSOLE.DEFAULT('#                \x1b[32mSUPERNODE \x1b[37m'+VERSION+'                #');
        CONSOLE.DEFAULT('#                                                #');
        CONSOLE.DEFAULT('##################################################')
        CONSOLE.DEFAULT('                                                  ');
        CONSOLE.DEFAULT('#> Checking server configuration...                     ');

        let ConfigurationManager = require('../Configuration/ConfigurationManager.js')
        let environment = await ConfigurationManager.new(
        {
            name: 'server_config',
            database: {
                type: 'json',
                saveonset: true,
                file: path.normalize(__dirname+'/../'+structure.file.env)
            }
        },  [
        'API_NAME',
        'INSTALLED',
        ]);

        console.log(environment);
        var api_name = environment.get(environment._index.API_NAME);
        var api_installed = environment.get(environment._index.INSTALLED);
        var response;
        if (!api_name) {
            CONSOLE.ERROR('#- No API founded.')
            CONSOLE.DEFAULT('## > Installation of new API..')
            response = await inquirer.prompt([
            {
                type: "input",
                name: "API_NAME",
                message: "Type your Application API name :",
                validate: function(value) {
                    if (/^[a-z0-9_\s]+$/i.test(String(value).toLowerCase())) {
                        return true
                    } else return 'Please enter a valide application name';
                }
            },
            ])
            .catch(error => {
                if(error.isTtyError) {
                } else {
                    throw new Error(error)
                }
            });
        }
        else {
            response = {API_NAME: api_name}
        }


        api_name = response[environment._index.API_NAME];
        CONSOLE.DEFAULT('#- Application found : \x1b[32m'+api_name)
        environment.set(environment._index.API_NAME,api_name)

        let ApiFactory = require('../builder/Factory.js');
        ApiFactory = new ApiFactory();
        let API = await ApiFactory.construct(environment);
        return API;
}

