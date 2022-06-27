module.exports = async ({ req , res , next }) => {
    let token = req.body.token || null;
    if (!token || !token.data || !token.type) {
        req.response.add_error('subscription', 'invalid')
        return req.respond(false);
    }
    await node.collections.profile.manager.registerSubscriptionPush(req.profile, token);
    return req.respond(true);
    console.log(token);
}
