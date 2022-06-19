module.exports = function (manager) {
    return async function (user, code) {
        code = node.services.crypter.RESALT.PIN(code);
        let profile = await manager.create({
            user: user.getID(),
            key: code,
        });
        return profile ? profile : false;
    }
}
