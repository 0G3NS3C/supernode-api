module.exports = async ({ req , res , next }) => {
    let code = req.body.code || null;
    if (!code) {
        req.response.error_add('code', 'invalid.code')
        req.respond(false);
    }
    let profile = await node.collections.profile.manager.createWithPin(req.user, code);

    if (profile) {
        profile = await profile.getObjectToSend();
        const {userKey,...profileToSend} = {...profile};
        return req.respond(profileToSend);
    } else return req.respond(false);
}
