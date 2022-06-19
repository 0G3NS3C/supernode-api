

let { CONSOLE } = require('./utils.js');

module.exports = async function({ http, API }) {

	API.start();
	let SSL = API._module('config').ssl;

	return new Promise((resolve) => {
		http.listen(API._module('config').port,null, async () => { 
			CONSOLE.DEFAULT(`#> HTTP${SSL ? '\x1b[32mS\x1b[0m' : ''} server -> ${SSL ? '\x1b[32msecure\x1b[0m' : 'unsecure'} listening on port \x1b[32m${API._module('config').port}\x1b[0m`)
			resolve(true);
		}); 
	})

}

