module.exports = async ({ req , res, next }) => {
    console.log('JOIN FLUX');
    let code = req.body.code;
    if (!code || code === '' || code === 'null' || !req.profile) return req.respond(false);
    let Flux = await node.collections.flux.manager.findByCode(code, req.profile);
    if (Flux) {
        await Flux.deleteInviteKey();
        await Flux.addClient(req.profile);
        await req.profile.addFlux(Flux);
        let socket = ogs.sockets._getByProfile(req.profile);
        if (socket) {
            socket.join(Flux.getKey());
        }

        ogs.sockets._broadcast(socket, Flux.getKey(),
            {
                type: 'fluxUpdate',
                data: await Flux.getObjectToSend(),
        })
        ogs.sockets._broadcast(socket, Flux.getKey(),
            {
                type: 'receiveNotification',
                data: {
                    type: 'biFluxJoin',
                    data: null,
                }
            })
        return req.respond(await req.profile.getObjectToSend());
    }
    else {
        req.response.add_error('flux',req.print('flux.invalid_code'))
        return req.respond(false);
    }
}
