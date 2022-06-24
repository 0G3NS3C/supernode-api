module.exports = async ({ req , res , next }) => {
        let profile = await node.collections.profile.manager.getBase(req.profile);
        profile = await node.collections.profile.manager.decodeBase(profile);
        return req.respond(profile);
}
