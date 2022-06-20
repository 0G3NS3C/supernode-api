module.exports = async ({ req , res , next }) => {

    let profile = await node.collections.profile.manager.findByUser(req.user);
    if (profile) {
        profile = await req.profile.getObjectToSend();
        return req.respond(profile);
    } else return req.respond(false);

}
