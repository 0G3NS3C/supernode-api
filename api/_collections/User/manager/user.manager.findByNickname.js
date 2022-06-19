

module.exports = function(manager) {
    return async function (nickname) {
        return await manager.findOne({nickname: nickname});
    }
}