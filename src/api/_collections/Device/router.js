module.exports =[
	{
		name: 'device',
		method: 'POST',
		path: '/mobile-get-integrity',
		controller: 'device.mobile-get-integrity',
		access: {
			role: 0, //<--- 1 for connected user, see middleware_checkAccess
			xhr: true, // true for rest request only, see middleware_checkAccess
		}
	},
]
