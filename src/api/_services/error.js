let commonDepsDir= __dirname+'/../';



let CONSTANTS= {
    ERROR: {
        IMPORTANT: ['TypeError','MongooseError','MongoServerError']
    }
}


   module.exports = {
    catch(req, error, device = null, user = null, security = false, watchButNotSave = false) {
        function errorRegister(data){
            let r = node.collections.error.manager.create(data, function (err, res) {
               // if (err) { throw err; console.log(err) }
            });
        }

        var importantError = CONSTANTS.ERROR.IMPORTANT;
        var stack, err, type = error.constructor || error.constructor.name || typeof (error);
        importantError = (importantError.indexOf(type) > -1)

                if (importantError) {
                    err = new Error(error);
                } else {
                    err = new Error();
                }

                stack = err.stack.split(' at');

                let callerFileInfo = _getStackFileCallerInfo(stack);
                let data = {
                    machine: device,
                    user: user || null,
                    function: callerFileInfo.function,
                    file: callerFileInfo.file,
                    fileroute: callerFileInfo.fileroute,
                    line: callerFileInfo.line,
                    date: new Date().toISOString(),
                    info: error['replace'] ? error.replace('\n', '') : JSON.stringify(error.stack)
                }

                console.log("");
                // console.log("\x1b[47m\x1b[31m :: ERROR :: \x1b[2m\x1b[30m" + data.machine.hostname + " :: " + data.machine.os + ' :: ' + data.machine.userAgent + '(' + data.machine.version + ') \x1b[0m');
                console.log('\x1b[47m \x1b[0m\x1b[37m ::File : \x1b[31m\x1b[1m ' + data.file);
                console.log('\x1b[47m \x1b[0m\x1b[37m ::Line : \x1b[31m\x1b[1m ' + data.line)
                console.log('\x1b[47m \x1b[0m\x1b[37m ::Path : \x1b[31m\x1b[1m ' + data.fileroute)
                console.log('\x1b[47m \x1b[0m\x1b[37m ::Info : \x1b[1m' + data.info);
                console.log("");

            if (!watchButNotSave) {
                errorRegister(data)
            }


    }
}

/* Private Functions */


function _getStackFileCallerInfo(stack) {
    let thisFileName = __filename.replace(/^.*[\\\/]/, '');
    var ret = {};
        // console.log(stack);
        for (let i =0; i<stack.length; i++)
        {

            if (!_countRegex(stack[i], '/'+thisFileName+'/g') && !_countRegex(stack[i], /Error/g) && !_countRegex(stack[i], /Object.c/g)) { 
                fileroute = stack[i].replace('\n','');
                let f = fileroute.split(':');
                ret.fileroute = f[0]+":"+f[1];
                let file = fileroute.replace(/^.*[\\\/]/, '');
                ret.file = file.split(':')[0];
                ret.line = file.split(':')[1];

                ret.function = "undefined";
                break;
            }
        }

        return ret;

    }


    function _countRegex(string,regex=null) {
      const re = regex || /YOUR_PATTERN_HERE/g
      return ((string || '').match(re) || []).length

  }