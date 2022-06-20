

module.exports =  async function middleware_checkAccess({ req, res, next }) {
    if (req.user) {
        req.profile = await node.collections.profile.manager.findByUser(req.user);
    }
    next();
}



