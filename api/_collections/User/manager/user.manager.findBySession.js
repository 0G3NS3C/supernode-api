var ObjectId = require('mongoose').Types.ObjectId;


module.exports = function (manager) {
    return async function (session) {
        let exist = await manager.findOne({ _id: new ObjectId(session.userId) });
        return exist ? exist : false;
    }
}
