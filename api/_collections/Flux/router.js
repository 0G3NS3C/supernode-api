module.exports =[
	{
		name: 'fluxSendMessage',
		method: 'POST',
		path: '/send-message',
		controller: 'flux.send-message',
		middlewares: ['root.checkDevice', 'root.checkSession', 'user.attach', 'profile.attach'],
		access: {
			xhr: true,
		}
	},
	{
		name: 'fluxEject',
		method: 'POST',
		path: '/eject',
		controller: 'flux.eject',
		middlewares: ['root.checkDevice', 'root.checkSession', 'user.attach', 'profile.attach'],
		access: {
			xhr: true,
		}
	},
]
