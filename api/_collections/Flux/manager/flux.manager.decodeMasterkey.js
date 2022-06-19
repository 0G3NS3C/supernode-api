
module.exports = function (manager) {
    return async function (masterkey) {
        masterkey = node.services.crypter.B64.DECODE(masterkey);
        masterkey = node.services.crypter.INTERNAL.DECODE(manager.SECRET.DB_FLUX,masterkey)
        return masterkey;

    }
}
