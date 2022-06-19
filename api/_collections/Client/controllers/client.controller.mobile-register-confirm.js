module.exports = async ({ req, res, next }) => {
    console.log('mobile register confirm');
    let payload = req.body.payload || null;
    let code = req.body.code || null;

    payload = node.services.transit.DECODE(payload);
    if (!payload) return req.respond(false);

    if (code) {
        if (code !== payload.code) {
            code = null;
            req.response.add_error('code', req.print('_registration.invalid_code'));
        }
    } else {
        req.response.add_error('code', req.print('_registration.missing_code'));
    }

    if (!code) return req.respond(false);

    let User;
    try {
        User = await node.collections.user.manager.new(payload);
    }
    catch(e) {
        req.response.add_error('code',e);
        return req.respond(false);
    }
    if (User['getObject']) {
        await node.services.session.create(User,req, res);
        return req.respond(true);
    }
    else {
        node.services.error.catch(req, User);
        req.response.add_error('api', 'something.wrong');
        return req.respond(false);
    }
}
