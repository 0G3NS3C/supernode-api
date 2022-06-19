module.exports = async ({ req , res , next }) => {
    let password = req.body.password || null;

    let payload = req.body.payload || null;

    if (!payload) return req.respond(false);
    if (!password) {
        req.response.add_error('password', req.print('_registration.password_missing'));
       return req.respond(false);
    }

    payload = node.services.transit.DECODE(payload);
    if (!payload) return req.respond(false);


    const User = await node.collections.user.manager.findOne({
        number: await node.collections.user.manager.encodeIndex(payload.number),
        password: password,
    })

    if (User) {
            await node.services.session.create(User,req, res);
           return req.respond(true)
    }
    else {
        req.response.add_error('api', req.print('api.auth_invalid'));
        req.respond(false);
    }

}
