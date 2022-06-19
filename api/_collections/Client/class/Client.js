const CollectionClass = require('../../../../src/collection/CollectionClass.js');

class Client extends CollectionClass {
	constructor(document, schema) {
		super(document, schema);
	}
}

module.exports = Client;
