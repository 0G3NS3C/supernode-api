module.exports = async ({ req , res , next }) => {
    console.log('CREATE PIN');
    let code = req.body.code || null;
    if (!code) {
        req.response.error_add('code', 'invalid.code')
        req.respond(false);
    }
    let profile = await node.collections.profile.manager.createWithPin(req.user, code);

    if (profile) {
        profile = await profile.getObjectToSend();
        const {userKey,...profileToSend} = {...profile};
        console.log('profile to send');
        console.log(profileToSend);
        return req.respond(profileToSend);
    } else return req.respond(false);
}
