module.exports = async ({ req, res, next }) => {
    console.log('CREATE BIFLUX');

    const profileFluxes = await req.profile.getProprietaryFreeFlux();

    if (profileFluxes.length >= 3) return req.respond(false);
    let flux = await node.collections.flux.manager.createEmptyForProfile(req.profile);
    if (flux) {
        console.log(node.sockets);
        let profileToSend = await req.profile.getObjectToSend();
        let socket = node.sockets._getByProfile(req.profile);
        if (socket) {
            socket.join(flux.getKey());
        }
      return  req.respond(await flux.getObjectToSend())
    }else {
      return  req.respond(false);
    }
}
