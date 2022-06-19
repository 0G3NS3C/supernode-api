module.exports =[
	{
		name: 'rootPing',
		method: 'GET',
		path: '/ping',
		controller: 'client.ping',
		middlewares: ['root.checkDevice'],
		access: {
			role: 0, //<--- 1 for connected user
			xhr: true,
		}
	}
]
