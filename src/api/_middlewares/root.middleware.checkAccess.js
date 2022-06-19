module.exports = async function middleware_checkAccess({req, res, next }) {
    if (req.method === "OPTIONS") {
        return res.send(true);
    }
    else if (req.route.xhr && req.route.xhr !== req.xhr) {
        req.response.add_error(null, 'Unauthorized [request-type] Access');
        return req.respond(null)
    } 
    else {
        return await next();
    }
}



