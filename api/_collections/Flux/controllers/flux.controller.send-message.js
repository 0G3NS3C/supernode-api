module.exports = async ({ req , res, next}) => {
    const flux = req.body.flux;
    const event = req.body.event;

    const returnMessageInError = () => {
        return req.respond({ key: 'status', value: 2 })
    }

    if (!flux || !event) return returnMessageInError();
    const Flux = await node.collections.flux.manager.findByKey(flux);
    if (!Flux) return returnMessageInError();
    const regex = new RegExp('^[\\w-_.]{32}$');
    if (!regex.test(event.key)) return returnMessageInError();

    const isOwner = await Flux.isOwner(req.profile.getKey());
    if (!isOwner) {
        const isClient = await Flux.isClient(req.profile.getKey());
        if (!isClient) {
          return returnMessageInError()
        }
    }

    event.timestamp = Date.now();
    event.originId = req.profile.getKey();
    const Event = await Flux.addEventClient(event);
    Event.status = 4;
    await Flux.save();

    const socket = node.sockets.getByIndex('profileKey', req.profile.getKey());

    const clients = await Flux.getClients();


    for (let client of clients) {
        if (client.key !== req.profile.getKey()) {
            let Profile = await node.collections.profile.manager.findByKey(client.key);
            let Socket = node.sockets.getByIndex('profileKey', client.key);
            if (!Socket) {
                node.services.expo.sendNotification(await Profile.getNotificationsTokens(), 'Quiet', 'Vous avez reçu un nouveau message');
            }
        }
    }

    if (socket) {
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
                return req.respond({
                    key: 'status',
                    value: Event.status,
                })
            }
            await Flux.save()
            return true;
        })
    }
    else {
        return req.respond({
                key: 'status',
                value: Event.status,
            })
    }


}
