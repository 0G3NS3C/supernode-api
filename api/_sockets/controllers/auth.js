module.exports = async (socket, req, data, node) => {

    console.log('GET AUTH');
    const X_DEVICE = OGS.$Security.tokens['x-device'].header;
    const X_SESSION = OGS.$Security.tokens['x-session'].header;
    const X_AUTH = OGS.$Security.tokens['socket-auth'];

    const deleteSocketAuth = () => {
        socket._send({
            type: 'setAuth',
            data: null,
        })
    }
    console.log(data);
    if (!data.xdevice || !data.xsession) return deleteSocketAuth();

    const xsession = OGS.$Services.crypter.JWT.DECODE(OGS.$Security.tokens[X_SESSION].key, data.xsession);
    if (xsession.device !== data.xdevice) return deleteSocketAuth();
    let user = await OGS.$Collections.user.manager.findBySession(xsession);
    if (!user) return deleteSocketAuth();
    let profile = await OGS.$Collections.profile.manager.findByUser(user);
    if (!profile) return deleteSocketAuth();
    let auth = {
        socketId: socket.id,
        userId: xsession.userId,
        profileKey: profile.getKey(),
    }
    OGS.$Sockets._cleanSocket(auth);
    OGS.$Sockets._registerSocket(socket, auth);
    socket.profile = profile;
    socket.user = user;
    socket.auth = OGS.$Services.crypter.JWT.ENCODE(OGS.$Security.tokens[X_AUTH.header].key, auth)
    socket._send({
        type: 'setAuth',
        data: ws.auth,
    })
}
