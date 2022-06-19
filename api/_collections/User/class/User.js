const CollectionClass = require('../../../../src/collection/CollectionClass.js');

class User extends CollectionClass {
	constructor(document, schema) {
		super(document, schema);
	}
}

module.exports = User;
