const ConfigurationManager = require("../configuration/ConfigurationManager");
const path = require("path");
const structure = require("../builder/_structure");
let commonDepsDir = __dirname + '/../';

/* JSON MEMORY SETTING */


require(commonDepsDir + "Configuration/ConfigurationManager.js").new(
    {
        name: 'security',
        database: {
            type: 'json',
            autosave: (60 * 5) * 1000,
            saveonset: true,
            file: __dirname + 'memory.json'
        }
    }, []);

/* SECURITY CLASS */
let memory = {};
const flood = {

    /* Security by function timer */

    register(name, index, options) {

        if (!_verifyOptions(options)) {
            return false;
        }

        var encodedIndex = OGS.$Services.crypter.B64.ENCODE(index.join('::')), count, time, dateNow = Date.now(),
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

        var encodedIndex = OGS.$Services.crypter.B64.ENCODE(index.join('::')), count, iCount = 'count';
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
			var encodedIndex = OGS.$Services.crypter.B64.ENCODE(index.join('::'));
			if (memory[name] && memory[name][encodedIndex]) {
          memory[name][encodedIndex] = [];
      }
		}

}

module.exports = {
    flood
};

_verifyOptions = function (options) {
    if (!options.time || typeof (options.time) !== 'number') {
        _throwError('No time options setted or is not Number type. options.time is required.');
        return false;
    }
    if (!options.count || typeof (options.count) !== 'number') {
        _throwError('No Count options setted or is not Number type. options.count is required.');
        return false;
    }
    return true;

},

    _throwError = function (msg) {
        throw new Error(':: ERROR :: Security.js -> ' + msg)
    }