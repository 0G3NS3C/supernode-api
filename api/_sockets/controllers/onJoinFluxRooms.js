module.exports = async (socket, req, data) => {
        if (socket.auth) {
                let Profile = await node.collections.profile.manager.findByKey(socket.auth.profileKey);
                let profile = await node.collections.profile.manager.getBase(Profile);
                profile = await node.collections.profile.manager.decodeBase(profile);
                profile.fluxes.forEach((flux) => {
                        socket.join(flux.key);
                        socket.broadcast(flux.key, {
                                type: 'userStatus',
                                data: {
                                        flux: flux.key,
                                        profile: socket.auth.profileKey,
                                        status: true,
                                }
                        })
                })
        }
}
