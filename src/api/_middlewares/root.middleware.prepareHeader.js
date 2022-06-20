
module.exports =  function middleware_prepareHeader({ req, res, next }) {
    const X_DEVICE = node.security.tokens['x-device-jwt'];
    const X_SESSION = node.security.tokens['x-session-jwt'];

    if (req.headers[X_DEVICE.header]) res.setHeader(X_DEVICE.header, req.headers[X_DEVICE.header])
    if (req.headers[X_SESSION.header]) res.setHeader(X_SESSION.header, req.headers[X_SESSION.header])

    if (req.headers) {
        let origin = req.headers.origin || req.headers.host;
        let headers = node.config.headers;
        if(headers['Access-Control-Allow-Origin'].indexOf(origin) > -1){
            res.setHeader('Access-Control-Allow-Origin', origin);
            for(let i in headers) {
                if (i!=="Access-Control-Allow-Origin") {
                    res.setHeader(i,headers[i])
                }
            }
            next();
        }
        else {
            res.send({error: 'Unauthorized Header Access'});
            res.end();
        }
    }
    else {
        console.log('pas de header')
    }
}



