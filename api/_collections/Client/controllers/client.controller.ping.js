module.exports = async ({ req, res, next }) => {
        console.log(node);
        try {
            req.respond('pong');
        } 
        catch(e) { node.services.error.catch(req, e); res.send(false) }
}
