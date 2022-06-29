module.exports = async ({ req, res, next }) => {
        try {
            res.send('pong');    
        } 
        catch(e) { node.services.error.catch(req, e); res.send(false) }
}
