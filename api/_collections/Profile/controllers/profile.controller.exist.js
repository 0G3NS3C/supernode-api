module.exports = async ({ req , res , next }) => {
        let Profile = await node.collections.profile.manager.findByUser(req.user);
        if (!Profile) req.respond(false);
        else {
                req.respond(true);
        }
}
