module.exports =[
	{
		name: 'rootPing',
		method: 'GET',
		path: '/ping',
		controller: 'client.ping',
		middlewares: [],
		access: {
			xhr: true,
		}
	},
]
