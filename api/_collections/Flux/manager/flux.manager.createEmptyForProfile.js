module.exports = function (manager) {
    return async function (profile) {

        let masterkey = manager.createMasterkey();
        masterkey = await manager.encodeMasterkey(masterkey);
        masterkey = node.services.crypter.INTERNAL.ENCODE(manager.SECRET.DB_FLUX,masterkey)
        masterkey = node.services.crypter.B64.ENCODE(masterkey);
        let flux = {
            type: manager.TYPES.BIDIRECTIONAL,
            owner: profile.getID(),
            invite_key: node.services.utils.randomToken(8).toUpperCase(),
            key: node.services.utils.randomToken(manager.OPTIONS.KEYLENGTH),
            mk: masterkey,
            options: {
                mode: node.collections.flux.manager.OPTIONS.MODE.SNAP,
            }
        }
        flux = await manager.create(flux);

        if (flux) {
            await profile.addFlux(flux);
            return flux;
        }
        else return false;


    }
}
