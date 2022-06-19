var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = {
	user: {
		type: ObjectId,
		ref: 'user',
	},
	key: {
		type: String,
		required: true,
	},
	aes: {
		type: String,
	},
	online: {
		type: Boolean,
	},
	fluxes: [ {
		type: ObjectId,
		ref: 'flux',
	}],
	timestamp_create: {
		type: Date,
		default: Date.now()
	},

};


