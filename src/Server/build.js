
let { CONSOLE } = require('./utils.js');

module.exports = async function({ API }) {

        let express = require('express');
        let app = express();
        var useragent = require('express-useragent');
        app.use(useragent.express());
        var bodyParser = require('body-parser');
        var cookieParser = require('cookie-parser')
        app.use(cookieParser())
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json({ limit: "3mb" }));
        app.use(function(req,res,next) {
        if (!API._module('config').cache) { res.setHeader('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        }
        else { res.setHeader('Cache-Control','public, max-age='+(API._module('config').cache.maxage/1000)); }
        next();
    })

        var Router = await API.build({ app, express });
                // console.log(API._module());
        /* Preparing SSL connexion */
        let SSL = API._module('config').ssl
        if (SSL) {
            var key = SSL.key;
            var cert = SSL.cert ;
            var ca = SSL.ca;
            var options = {
                key: key,
                cert: cert,
                ca: ca
            };
            var http = require('https');
            http = http.createServer(options, app);
        }else { /* Without SSL */
            var http = require('http').Server(app);
        }

        if (Router) {
            return http;
        }
           
}

