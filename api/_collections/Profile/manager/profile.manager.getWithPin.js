var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function (manager) {
    return async function (user, code) {
        code = node.services.crypter.RESALT.PIN(code);
        let profile = await manager.findOne({
            user: ObjectId(user.getID()),
            code: code,
        });
        return profile ? profile : false;
    }
}
