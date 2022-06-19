var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


const SubSchemaEvents= new mongoose.Schema(
	{
		key: {
			type: String,
			required: true,
		},
		target:{
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum:['text', 'audio'],
			default: 'text',
			required: true
		},
		origin: {
			type: String,
			enum : ['client','system'],
			default: 'system',
			required: function() { return this.origin === 'client'; },
		},
		originId: {
			type: String,
			required: true,
		},
		encrypted: {
			type: Boolean,
			required: true,
			default: true,
		},
		data: {
			type: String,
			required: true,
		},
		status: {
			type:  Number,
			enum:[0,1,2,3,4,5,6,7,8],
			required: function() { return 1 },
		},
		security: {
			type: Number,
			required: true,
			default: 0,
		},
		timestamp: {
			type: Number,
			default: new Date(),
		},
		memory: [Boolean,Boolean,Boolean], /* [enregistrement_local_clientA, enregistement_local_clientB, entregistrement_server] */
	},{ _id : false });

module.exports = {
	type: {
		type: String,
		enum: ['bi', 'multi'],
		required: true,
	},
	mk : {
		type: String,
		required: true,
		unique: true,
	},
	key: {
		type: String,
		required: true,
		unique: true,
		sparse: true,
	},
	owner: {
		type: ObjectId,
		ref: 'profile',
	},
	clients:[
		{
			type: ObjectId,
			ref: 'profile',
		}
	],
	invite_key: {
		type: String,
		unique: true,
		sparse: true,
	},
	events: [SubSchemaEvents],

	timestamp_create: {
		type: Date,
		default: Date.now()
	},
	options: Object,

};


