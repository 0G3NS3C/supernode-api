module.exports = async ({ req, res, next }) => {
        console.log(node);

        console.log(node.collections.session.manager);
        try {
            res.send('pong');    
        } 
        catch(e) { node.services.error.catch(req, e); res.send(false) }
}
