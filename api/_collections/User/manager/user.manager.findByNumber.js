

module.exports = function(manager) {
    return async function (number) {
        return await manager.findOne({number: number});
    }
}