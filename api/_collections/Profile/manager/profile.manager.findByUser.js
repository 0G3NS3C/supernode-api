var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(manager) {
    return async function (user) {
        let exist = await manager.findOne({ user:new ObjectId(user.getID()) });
        return exist ? exist : false;
    }
}
