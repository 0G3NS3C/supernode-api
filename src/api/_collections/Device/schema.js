

module.exports = {
	uniqID: {
		type: String,
		unique: true,
		required: true
	},
	type: {
		type: String, //app or phone
		enum: ['PHONE','WEB'],
	},
	brand: {
		type: String
	},
	version: {
		type: String,
	},
	buildId: String,
};


