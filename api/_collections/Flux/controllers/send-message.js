module.exports = async (ctx) => {
    const flux = ctx.req.body.flux;
    const event = ctx.req.body.event;

    const returnMessageInError = () => {
        return ctx.req.respond({
            key: 'status',
            value: 2
        })
    }

    if (!flux || !event) return returnMessageInError();
    const Flux = await OGS.$Collections.flux.manager.findByKey(flux);
    if (!Flux) return returnMessageInError();
    const regex = new RegExp('^[\\w-_.]{32}$');
    if (!regex.test(event.key)) return returnMessageInError();

    event.timestamp = Date.now();
    event.originId = ctx.req.profile.getKey();
    const Event = await Flux.addEventClient(event);
    Event.status = 4;
    await Flux.save();

    const socket = OGS.$Sockets._getByProfile(ctx.req.profile);
    if (!socket || !socket.isIn(flux)) return returnMessageInError();
    if (!socket['isAuth'] && !socket.isAuth()) {
        ctx.req.respond({
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
                ctx.req.respond({
                    key: 'status',
                    value: 6
                })
            } else {
                ctx.req.respond({
                    key: 'status',
                    value: Event.status,
                })
            }
            await Flux.save()
            return true;
        })
    }
}
