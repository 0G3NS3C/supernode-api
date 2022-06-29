var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function (manager) {
    return async function (user) {
        //A RETAPER AVEC NOUVELLE API
        let profile = await manager.findOne({ user:new ObjectId(user.getID()) });

        //a finir poru ejecter de tout les flux;
        if (profile) {
            const fluxes = await profile.getAllFluxes();
            for (let flux of fluxes) {
                const Flux = await OGS.$Collections.flux.manager.findByKey(flux.key);
                await Flux.eject(profile);
                if (Flux.getType() === OGS.$Collections.flux.manager.TYPES.BIDIRECTIONAL) {
                    await Flux.reinitialisation();
                    await Flux.save();
                    let socket = OGS.$Sockets._getByProfile(profile);
                    if (socket) {
                        socket._send({
                            type: 'fluxUpdate',
                            data: await Flux.getObjectToSend(),
                        })
                        OGS.$Sockets._broadcast(socket, Flux.getKey(),
                            {
                                type: 'fluxUpdate',
                                data: await Flux.getObjectToSend(),
                            })
                    }
                }
            }
            manager.remove(profile);
            return true;
        }
    }
}
