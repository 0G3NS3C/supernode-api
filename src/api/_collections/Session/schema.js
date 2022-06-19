
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = {
	key: {
		type: String,
	},
	device: {
		type: String
	},
	userId: {
		type: ObjectId,
		ref: 'user',
	},
	agent: {
		type: Object,
	},
	terminated: {
		type: Boolean,
		default:false
	},
	timestamp_create: {
		type: Number,
		default: new Date(),
	},
};


