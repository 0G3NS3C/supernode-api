module.exports = function (manager) {
    return async function (profile) {

        let masterkey = manager.createMasterkey();
        masterkey = await manager.encodeMasterkey(masterkey);

        let flux = {
            type: manager.TYPES.BIDIRECTIONAL,
            owner: profile.getID(),
            invite_key: await manager.createInviteKey(),
            key: node.services.utils.randomToken(manager.OPTIONS.KEYLENGTH),
            mk: masterkey,
            options: {
                mode: node.collections.flux.manager.OPTIONS.MODE.SNAP,
            }
        }
        flux = await manager.create(flux);

        if (flux) return flux;
        else return false;


    }
}
