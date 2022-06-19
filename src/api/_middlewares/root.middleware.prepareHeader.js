
module.exports =  function middleware_prepareHeader({ req, res, next }) {
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



