
module.exports = function (manager) {
    return async function (key) {
        return await manager.findOne({
            key: key,
        });
    }
}
