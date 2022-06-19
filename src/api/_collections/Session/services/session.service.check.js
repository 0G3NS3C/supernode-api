

module.exports = async function (session, deviceId) {
    if (session.device !== deviceId) return false;
    const existSession = await node.collections.session.manager.findOne({
        key: session.key,
        device: deviceId,
    })
    if (existSession) {
        return existSession;
    }
      return false
    }