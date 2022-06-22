module.exports = async (socket, req, data) => {
        console.log('ITS FLUX JOIN ROOOM FUNCITON');
        if (socket.auth) {
                console.log('je suis auth')
                let profile = await node.collections.profile.manager.findByKey(socket.auth.profileKey);
                profile = await profile.getObjectToSend();
                console.log('SOCKET JOIN ROOM : ');
                profile.fluxes.forEach((flux) => {
                        console.log(flux.key);
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
