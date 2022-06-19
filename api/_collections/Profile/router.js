module.exports =[
	{
		name: 'profileExist',
		method: 'POST',
		path: '/exist',
		controller: 'profile.exist',
		middlewares: ['root.checkDevice', 'root.checkSession', 'user.attach'],
		access: {
			xhr: true,
		}
	},
	{
		name: 'profileCreatePin',
		method: 'POST',
		path: '/create-pin',
		controller: 'profile.create-pin',
		middlewares: ['root.checkDevice', 'root.checkSession', 'user.attach'],
		access: {
			xhr: true,
		}
	},
	{
		name: 'profileCheckPin',
		method: 'POST',
		path: '/check-pin',
		controller: 'profile.check-pin',
		middlewares: ['root.checkDevice', 'root.checkSession', 'user.attach'],
		access: {
			xhr: true,
		}
	},
	{
		name: 'profileCreateBiFlux',
		method: 'POST',
		path: '/create-biflux',
		controller: 'profile.create-biflux',
		middlewares: ['root.checkDevice', 'root.checkSession', 'user.attach', 'profile.attach'],
		access: {
			xhr: true,
		}
	},
	{
		name: 'profileJoinFlux',
		method: 'POST',
		path: '/join-flux',
		controller: 'profile.join-flux',
		middlewares: ['root.checkDevice', 'root.checkSession', 'user.attach', 'profile.attach'],
		access: {
			xhr: true,
		}
	},
]
