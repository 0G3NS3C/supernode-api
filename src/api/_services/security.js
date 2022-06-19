
const utils = require('../../security/utils');

	module.exports=  {
		flood:  {

			/* Security by function timer */

			register(name, index, options) {

				if (!_verifyOptions(options)) {
					return false;
				}

				var encodedIndex = node.services.crypter.B64.ENCODE(index.join('::')), count, time, dateNow = Date.now(),
				iTime = 'time', iCount = 'count';

				if (!memory[name]) {
					memory[name] = {}
				}

				count = options.count || 1;
				time = options.time || null;

				if (!time) {
					_throwError('Invalid or inexistant options.time for Security.flood function.');
				}

				if (!memory[name][encodedIndex]) {
					memory[name][encodedIndex] = [];
					memory[name][encodedIndex][iTime] = dateNow + (options.time * 1000);
					memory[name][encodedIndex][iCount] = 1;
					return memory[name][encodedIndex][iCount];
				} else {

					if (memory[name][encodedIndex][iTime] >= dateNow && memory[name][encodedIndex][iCount] >= count) {
						if (options.time_cumulation) {
							memory[name][encodedIndex][iTime] = dateNow + (options.time * 1000);
						}
						return false;
					} else if (memory[name][encodedIndex][iTime] >= dateNow && memory[name][encodedIndex][iCount] < count) {
						memory[name][encodedIndex][iCount]++;
					} else {
						memory[name][encodedIndex][iTime] = dateNow + (options.time * 1000);
						memory[name][encodedIndex][iCount] = 1;
					}
					return memory[name][encodedIndex][iCount];
				}
			},

			precheck(name, index, options) {

				var encodedIndex = node.services.crypter.B64.ENCODE(index.join('::')), count, iCount = 'count';
				count = options.count || 1;
				if (!memory[name] || !memory[name][encodedIndex]) {
					return true;
				} else if (memory[name][encodedIndex]) {
					if (memory[name][encodedIndex][iCount] >= count) {
						return false
					} else {
						return true
					}
				}
			},

			reset(name, index) {
				var encodedIndex = node.services.crypter.B64.ENCODE(index.join('::'));
				if (memory[name] && memory[name][encodedIndex]) {
					memory[name][encodedIndex] = [];
				}
			}

		}
	}
