module.exports =[
	{
		name: 'clientPing',
		method: 'GET',
		path: '/ping',
		controller: 'client.ping',
		access: {
			xhr: false, // true for rest request only
		}
	},
	{
		name: 'clientMobileCheckNumber',
		method: 'POST',
		path: '/mobile/check-number',
		controller: 'client.mobile-check-number',
		middlewares: ['root.checkDevice'],
		access: {
			xhr: false, // true for rest request only
		}
	},
	{
		name: 'clientMobileRegister',
		method: 'POST',
		path: '/mobile/register',
		controller: 'client.mobile-register',
		middlewares: ['root.checkDevice'],
		access: {
			xhr: false, // true for rest request only
		}
	},
	{
		name: 'clientMobileRegisterConfirm',
		method: 'POST',
		path: '/mobile/register-confirm',
		controller: 'client.mobile-register-confirm',
		middlewares: ['root.checkDevice'],
		access: {
			xhr: false, // true for rest request only
		}
	},
	{
		name: 'clientConnectPassword',
		method: 'POST',
		path: '/connect-password',
		controller: 'client.connect-password',
		middlewares: ['root.checkDevice'],
		access: {
			xhr: false, // true for rest request only
		}
	},
]
