

module.exports = function(manager) {
    return async function (device) {
        const result = await manager.create(device);
        return result;
    }
}