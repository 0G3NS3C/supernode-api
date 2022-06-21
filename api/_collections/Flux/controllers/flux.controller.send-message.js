module.exports = async ({ req , res, next}) => {
    const flux = req.body.flux;
    const event = req.body.event;

    const returnMessageInError = () => {
        return req.respond({
            key: 'status',
            value: 2
        })
    }

    if (!flux || !event) return returnMessageInError();
    const Flux = await node.collections.flux.manager.findByKey(flux);
    if (!Flux) return returnMessageInError();
    const regex = new RegExp('^[\\w-_.]{32}$');
    if (!regex.test(event.key)) return returnMessageInError();

    event.timestamp = Date.now();
    event.originId = req.profile.getKey();
    console.log('originId');
    console.log(event.originId);
    const Event = await Flux.addEventClient(event);
    Event.status = 4;
    await Flux.save();

    const socket = node.sockets._getByProfile(req.profile);
    if (!socket || !socket.isIn(flux)) return returnMessageInError();
    if (!socket['isAuth'] && !socket.isAuth()) {
        req.respond({
            key: 'status',
            value: Event.status,
        })
    }
    else {
        socket.broadcast(flux, {
            type: 'receiveMessage',
            data: {
                flux: flux,
                event: event,
            }
        }, async (broadcasted) => {
            if (broadcasted) {
                Event.status = 6;
                req.respond({
                    key: 'status',
                    value: 6
                })
            } else {
                req.respond({
                    key: 'status',
                    value: Event.status,
                })
            }
            await Flux.save()
            return true;
        })
    }
}
