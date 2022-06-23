module.exports = async ({ req , res, next}) => {
    const flux = req.body.flux;

    const Flux = await node.collections.flux.manager.findByKey(flux);

    const isOwner = await Flux.isOwner(req.profile.getKey());
    const isClient = await Flux.isClient(req.profile.getKey());
    const owner = await Flux.getOwner();
    const clients = await Flux.getClients();

    await Flux.eject(req.profile);
    await Flux.reinitialisation();

    console.log('owner');
    console.log(owner);
    console.log('clients');

    console.log(clients);
    if (isOwner) {
            console.log('CLIENTS :::');
            console.log(clients);
        for (let client of clients) {
            let socketclient = await node.sockets.getByIndex('profileKey', client.key);
            if (socketclient) {
                let profileclient = await node.collections.profile.manager.findByKey(client.key)
                socketclient._send({
                    type: 'setBase',
                    data: await profileclient.getObjectToSend(),
                })
            }
        }
    }
    else if (isClient) {
        let ownerclient = await node.sockets.getByIndex('profileKey', owner.key);
            if (ownerclient) {
                let profileowner = await node.collections.profile.manager.findByKey(owner.key)
                ownerclient._send({
                    type: 'setBase',
                    data: await profileowner.getObjectToSend(),
                })
            }
    }

    req.respond(await req.profile.getObjectToSend())
}
