var ObjectId = require('mongoose').Types.ObjectId;


module.exports = function (manager) {
    return async function (session) {
        let exist = await manager.findOne({ key: session.key });
        return exist ? exist : false;
    }
}
