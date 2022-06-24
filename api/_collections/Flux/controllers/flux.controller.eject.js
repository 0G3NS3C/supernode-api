module.exports = async ({ req , res, next}) => {
    const flux = req.body.flux;

    const Flux = await node.collections.flux.manager.findByKey(flux);

    const isOwner = await Flux.isOwner(req.profile.getKey());
    const isClient = await Flux.isClient(req.profile.getKey());
    const owner = await Flux.getOwner();
    const clients = await Flux.getClients();



    await Flux.eject(req.profile);
    await Flux.reinitialisation();


    if (isOwner) {
        for (let client of clients) {
            let socketclient = node.sockets.getByIndex('profileKey', client.key);
            if (socketclient) {
                console.log('there is socket client');
                let profileclient = await node.collections.profile.manager.findByKey(client.key)
                socketclient._send({
                    type: 'fluxDelete',
                    data: Flux.getKey(),
                })
                socketclient.leave(Flux.getKey())
            }
        }
        let fluxSend = await node.collections.flux.manager.findOneInProfile(Flux.getKey(), req.profile);
        return req.respond(fluxSend);
    }
    else if (isClient) {
        const socket = node.sockets.getByIndex('profileKey', req.profile.getKey());
        if (socket) socket.leave(Flux.getKey())
        let ownerclient = node.sockets.getByIndex('profileKey', owner.key);
            if (ownerclient) {
                let ProfileOwner = await node.collections.profile.manager.findByKey(owner.key);
                let fluxSend = await node.collections.flux.manager.findOneInProfile(Flux.getKey(), ProfileOwner)
                ownerclient._send({
                    type: 'fluxUpdate',
                    data: fluxSend,
                })
            }
        let fluxSend = await node.collections.flux.manager.findOneInProfile(Flux.getKey(), req.profile);
        return req.respond(Flux.getKey());

    }


}
