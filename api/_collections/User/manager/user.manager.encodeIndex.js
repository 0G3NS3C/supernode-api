module.exports = function (manager) {
    return  async function(value) {
        const newValue = await node.services.crypter.INTERNAL.ENCODE(node.collections.user.manager.SECRET.DB_USER,value);
        return newValue;
    }
}
