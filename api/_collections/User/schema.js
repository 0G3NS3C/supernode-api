module.exports = {
	nickname: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		unique: true,
		sparse: true,
	},
	password: {
		type: String
	},
	number: {
		type: String,
		unique: true,
		required: true,
		sparse: true
	},

	timestamp_create: {
		type: Date,
		default: Date.now()
	},

};


