module.exports = function (manager) {
    return  async function(value) {
        let newValue;
        try{
           newValue = await node.services.crypter.INTERNAL.DECODE(node.collections.user.manager.SECRET.DB_USER,value);
        }catch(e) {
            newValue = value;
        }
        return newValue;
    }
}
