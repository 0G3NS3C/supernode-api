

module.exports = function(manager) {
    return async function (uniqID) {
        const result = await manager.findOne({ uniqID: uniqID });
        return result;
    }
}