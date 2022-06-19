

module.exports =  async function (User, req, res) {
        const X_SESSION = node.security.tokens['x-session-jwt'];
        const X_DEVICE = node.security.tokens['x-device-jwt'];
        let agent = node.services.device.getAgentInfos(req);

        let device = req.headers[X_DEVICE.header];
        let session = {
            key: node.services.utils.randomToken(16),
            device: device,
            agent: agent,
            userId: User.getID(),
        }
        session = await node.collections.session.manager.create(session);
        session = node.services.crypter.JWT.ENCODE(X_SESSION.key, session.getObject(), "365d");
        res.set(X_SESSION.header, session)
        return true;
    }