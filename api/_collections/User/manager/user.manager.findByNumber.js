

module.exports = function(manager) {
    return async function (number) {
        number = await node.collections.user.manager.encodeIndex(number);
        return await manager.findOne({number: number});
    }
}