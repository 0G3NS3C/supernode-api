

module.exports = function(manager) {
    return async function (device) {
        const result = await manager.findOne(device);
        return result;
    }
}