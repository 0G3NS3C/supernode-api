module.exports = function (manager) {
    return async function (user, code) {
        code = node.services.crypter.RESALT.PIN(code);
        let profile = await manager.create({
            user: user.getID(),
            code: code,
            key: node.services.utils.randomToken(30),
        });
        return profile ? profile : false;
    }
}
