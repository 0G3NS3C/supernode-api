const CollectionClass = require('../../../../../src/collection/CollectionClass.js');

class Session extends CollectionClass {
	constructor(document, schema) {
		super(document, schema);
	}
}

module.exports = Session;
