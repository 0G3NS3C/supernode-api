module.exports = async (socket, req, data) => {
        console.log('ITS FLUX JOIN ROOOM FUNCITON');
        if (socket.isAuth()) {
                console.log('je suis auth')
                let profile = await socket.profile.getObjectToSend();
                console.log('SOCKET JOIN ROOM : ');
                profile.fluxes.forEach((flux) => {
                        console.log(flux.key);
                        socket.join(flux.key);
                        socket.broadcast(flux.key, {
                                type: 'userStatus',
                                data: {
                                        flux: flux.key,
                                        profile: socket.profile.getKey(),
                                        status: true,
                                }
                        })
                })
        }
}
