module.exports = async ({ req , res, next }) => {
    let code = req.body.code;
    if (!code || code === '' || code === 'null' || !req.profile) return req.respond(false);
    let Flux = await node.collections.flux.manager.findByCode(code, req.profile);
    if (Flux) {
        await Flux.deleteInviteKey();
        await Flux.addClient(req.profile);
        await req.profile.addFlux(Flux);

        //let FluxSend = await node.Flux.getObjectToSend();

        let fluxSend = await node.collections.flux.manager.findOneInProfile(Flux.getKey(), req.profile);
        let socket = node.sockets.getByIndex('profileKey', req.profile.getKey());

        if (socket)  {  
            socket.join(Flux.getKey());
            socket.broadcast(Flux.getKey(),  {
                    type: 'fluxUpdate',
                    data: fluxSend,
            })
            socket.broadcast(Flux.getKey(),
                {
                    type: 'receiveNotification',
                    data: {
                        type: 'biFluxJoin',
                        data: null,
                    }
            })
        }
        return req.respond(fluxSend);
    }
    else {
        req.response.add_error('flux',req.print('flux.invalid_code'))
        return req.respond(false);
    }
}
