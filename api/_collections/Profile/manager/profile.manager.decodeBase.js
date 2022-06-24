var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(manager) {
    return async function (profile) {
        profile.nickname = await node.collections.user.manager.decodeIndex(profile.nickname);

        for (let flux of profile.fluxes) {
            flux.mk = await node.collections.flux.manager.decodeMasterkey(flux.mk);
            if (flux.invite_key) flux.invite_key = await node.collections.flux.manager.decodeInviteKey(flux.invite_key);
            flux.owner.user.nickname = await node.collections.user.manager.decodeIndex(flux.owner.user.nickname);
            flux.owner.online = node.sockets.getByIndex('profileKey',flux.owner.key) ? true : false;
            for (let client of flux.clients) {
                if (client.user && client.user.nickname) {
                    if (client.user.nickname) {
                        client.user.nickname = await node.collections.user.manager.decodeIndex(client.user.nickname);
                    }
                    client.online = node.sockets.getByIndex('profileKey',client.key) ? true : false;
                }
            }
        }

        return profile;
    }   
}
