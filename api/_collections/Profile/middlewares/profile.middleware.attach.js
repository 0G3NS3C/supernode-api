

module.exports =  async function middleware_checkAccess({ req, res, next }) {
    console.log('middleware attach profil');
    if (req.user) {
            console.log('profil found and attach');
        req.profile = await node.collections.profile.manager.findByUser(req.user);
    }
    next();
}



