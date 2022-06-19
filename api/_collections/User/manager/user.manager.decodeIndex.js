module.exports = function (manager) {
    return  async function(value) {
        const newValue = await node.services.crypter.INTERNAL.DECODE(node.collections.user.manager.SECRET.DB_USER,value);
        return newValue;
    }
}
