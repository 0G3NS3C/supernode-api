module.exports = async (socket, req, data) => {
    console.log('ITS SOCKET SET VIEWED FUNCTION');
    if (socket.auth) {
        if (!data || !data.event || !data.flux) return false;
        const event = data.event;
        const flux = data.flux;
        event.status = 7;
        const Flux = await node.collections.flux.manager.findByKey(flux);
        if (!Flux) return false;
        if (Flux.getOptions().mode === node.collections.flux.manager.OPTIONS.MODE.SNAP) {
           Flux.deleteEvent(event);
        }
        if (socket.isIn(flux)) {
            socket.broadcast(flux, {
                type: 'eventUpdate',
                data: {
                    flux: flux,
                    event: event,
                    key: 'status',
                    value: 7,
                }
            })
            if (Flux.getOptions().mode === node.collections.flux.manager.OPTIONS.MODE.MESSENGER) {
                await Flux.updateEvent(event, 'status', 7);
            }
            return true;
        }
        else return false;

    }
}