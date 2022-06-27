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
    const isClient = await Flux.isClient(req.profile.getKey());
    if (!isOwner && !isClient)  return returnMessageInError()


    event.timestamp = Date.now();
    event.originId = req.profile.getKey();
    const Event = await Flux.addEventClient(event);
    Event.status = 4;
    await Flux.save();



    const clients = await Flux.getClients();
    if (isClient) {
        const owner = await Flux.getOwner();
        let Profile = await node.collections.profile.manager.findByKey(owner.key);
        let Socket = node.sockets.getByIndex('profileKey', owner.key);

        if (!Socket) node.services.expo.sendNotification(
            await Profile.getNotificationsTokens(), 
            await node.collections.user.manager.decodeIndex(await req.profile.getNickname()),
            'New encrypted message',
        );
    }
    for (let client of clients) {
        if (client.key !== await req.profile.getKey()) {
            let Profile = await node.collections.profile.manager.findByKey(client.key);
            let Socket = node.sockets.getByIndex('profileKey', client.key);
            if (!Socket) {
                node.services.expo.sendNotification(
                    await Profile.getNotificationsTokens(), 
                    await node.collections.user.manager.decodeIndex(await req.profile.getNickname()),
                    'New encrypted message',
                );
            }
        }
    }

    const socket = node.sockets.getByIndex('profileKey', req.profile.getKey());
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
