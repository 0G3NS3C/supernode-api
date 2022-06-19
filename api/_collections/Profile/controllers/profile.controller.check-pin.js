module.exports = async ({ req, res, next }) => {
    let code = ctx.req.body.code || null;
    const X_DEVICE = node.security.tokens['x-device-jwt'].header;
    // if (!node.services.security.flood.register(
    //     'checkCode',
    //     [ctx.req.agent.ip, ctx.req.xdevice],

    //     {
    //         count: 2,
    //         time: 31536000
    //      }
    //     )){
    //     console.log('BLOCKED BY SECURITY');
    //     OGS.$Services.security.flood.reset('checkCode',[ctx.req.agent.ip, ctx.req.headers[X_DEVICE]]);
    //     OGS.$Collections.profile.manager.destroyCodeSession(ctx.req.user);
    //     ctx.req.response.error_add('protect',ctx.req.print('pin.invalidreset'
    //     ));
    //     return ctx.req.respond(false);
    // }
    let profile = await node.collections.profile.manager.getWithPin(req.user, code);
    if (profile) {
        //OGS.$Services.security.flood.reset('checkCode',[ctx.req.agent.ip, ctx.req.headers[X_DEVICE]]);
        await profile.setAllEventsReceived()
        profile = await profile.getObjectToSend();
        return req.respond(profile);
    }else {
        req.response.add_error('pin',req.print('pin.invalid'));
        return req.respond(false);
    }
}
