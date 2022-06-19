
module.exports = function (manager) {
    return async function (masterkey) {
        masterkey = node.services.crypter.INTERNAL.ENCODE(manager.SECRET.DB_FLUX,masterkey)
        masterkey = node.services.crypter.B64.ENCODE(masterkey);
        return masterkey;

    }
}
