module.exports = async ({ req , res, next}) => {
    const flux = req.body.flux;

    const Flux = await node.collections.flux.manager.findByKey(flux);

    const isOwner = await Flux.isOwner(req.profile.getKey());
    const isClient = await Flux.isClient(req.profile.getKey());
    const owner = await Flux.getOwner();
    const clients = await Flux.getClients();

    await Flux.eject(req.profile);
    await Flux.reinitialisation();
    const socket = await node.sockets.getByIndex('profileKey', req.profile.getKey());

    if (socket) socket.leave(Flux.getKey())

    if (isOwner) {
        for (let client of clients) {
            let socketclient = await node.sockets.getByIndex('profileKey', client.key);
            if (socketclient) {
                let profileclient = await node.collections.profile.manager.findByKey(client.key)
                socketclient._send({
                    type: 'deleteFlux',
                    data: Flux.getKey(),
                })
                socketclient.leave(Flux.getKey())
            }
        }
    }
    else if (isClient) {
        let ownerclient = await node.sockets.getByIndex('profileKey', owner.key);
            if (ownerclient) {
                let profileowner = await node.collections.profile.manager.findByKey(owner.key)
                ownerclient._send({
                    type: 'updateFlux',
                    data: await Flux.getObjectToSend(),
                })
                ownerclient.leave(Flux.getKey());
            }
    }


}
