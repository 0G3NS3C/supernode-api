module.exports = async ({ req , res, next }) => {
    let code = req.body.code;
    if (!code || code === '' || code === 'null' || !req.profile) return req.respond(false);
    let Flux = await node.collections.flux.manager.findByCode(code, req.profile);
    if (Flux) {
        await Flux.deleteInviteKey();
        await Flux.addClient(req.profile);
        await req.profile.addFlux(Flux);

        FluxSend = await Flux.getObjectToSend();
        console.log('flux send : ')
        console.log(FluxSend);
        let socket = node.sockets.getByIndex('profileKey', req.profile.getKey());

        if (socket)  {  
            socket.join(Flux.getKey());
            socket.broadcast(Flux.getKey(),  {
                    type: 'fluxUpdate',
                    data: FluxSend,
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
        let ProfileReturn = await req.profile.getObjectToSend();
        return req.respond(ProfileReturn);
    }
    else {
        req.response.add_error('flux',req.print('flux.invalid_code'))
        return req.respond(false);
    }
}
