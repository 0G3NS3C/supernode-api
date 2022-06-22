module.exports = async ({ req , res, next}) => {
    const flux = req.body.flux;

    const Flux = await node.collections.flux.manager.findByKey(flux);

    const clients = await Flux.getClients();
    await Flux.eject(req.profile);
    await Flux.reinitialisation();

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

    req.respond(await req.profile.getObjectToSend())
}
