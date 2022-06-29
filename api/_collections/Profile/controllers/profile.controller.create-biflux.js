module.exports = async ({ req, res, next }) => {
    const profileFluxes = await req.profile.getProprietaryFreeFlux();

    if (profileFluxes.length >= 3) return req.respond(false);
    let Flux = await node.collections.flux.manager.createEmptyForProfile(req.profile);
    if (Flux) {
        await req.profile.addFlux(Flux);

        let socket = node.sockets.getByIndex('profilKey',req.profile.getKey());
        if (socket) {
            socket.join(flux.getKey());
        }
        let fluxToSend = await node.collections.flux.manager.findOneInProfile(Flux.getKey(), req.profile);
      return  req.respond(fluxToSend);
    }else {
      return  req.respond(false);
    }
}
