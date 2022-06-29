module.exports = async (socket, req, data) => {

    const X_DEVICE = node.security.tokens['x-device-jwt'].header;
    const X_SESSION = node.security.tokens['x-session-jwt'];
    const X_AUTH = node.security.tokens['socket-auth-jwt'];

    const deleteSocketAuth = () => {
        socket._send({
            type: 'setAuth',
            data: null,
        })
    }
    if (!data.xdevice || !data.xsession) return deleteSocketAuth();

    const xsession = node.services.crypter.JWT.DECODE(X_SESSION.key, data.xsession);
    const xsessionExist = await node.collections.session.manager.findByKey(xsession);
    if (!xsessionExist) return deleteSocketAuth();
    if (xsession.device !== data.xdevice) return deleteSocketAuth();
    let user = await node.collections.user.manager.findBySession(xsession);
    if (!user) return deleteSocketAuth();
    let profile = await node.collections.profile.manager.findByUser(user);
    if (!profile) return deleteSocketAuth();

    let auth = {
        socketId: socket.id,
        userId: xsession.userId,
        profileKey: profile.getKey(),
    }

    node.sockets.registerSocket(socket, auth);

    socket._send({
        type: 'setAuth',
        data: auth,
    })

    socket._send({
        type: 'ping'
    });
}
