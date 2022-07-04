

module.exports =  async function({ req, res, next }) {
    if (req.user) {
        req.profile = await node.collections.profile.manager.findByUser(req.user);
    }
    next();
}



