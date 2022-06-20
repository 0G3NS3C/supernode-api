module.exports = async (socket, req, data) => {

    console.log('GET AUTH');
    const X_DEVICE = node.security.tokens['x-device-jwt'].header;
    const X_SESSION = node.security.tokens['x-session-jwt'];
    const X_AUTH = node.security.tokens['socket-auth-jwt'];

    const deleteSocketAuth = () => {
        socket._send({
            type: 'setAuth',
            data: null,
        })
    }
    console.log(data);
    if (!data.xdevice || !data.xsession) return deleteSocketAuth();

    const xsession = node.services.crypter.JWT.DECODE(X_SESSION.key, data.xsession);
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
    node.sockets._cleanSocket(auth);
    node.sockets._registerSocket(socket, auth);
    socket.profile = profile;
    socket.user = user;
    socket.auth = node.services.crypter.JWT.ENCODE(X_AUTH.key, auth)
    socket._send({
        type: 'setAuth',
        data: socket.auth,
    })
}