var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function (manager) {
    return async function (key) {
        let exist = await manager.findOne({ key: key });
        return exist ? exist : false;
    }
}
