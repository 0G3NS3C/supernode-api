const CollectionClass = require('../../../../src/collection/CollectionClass.js');

class Profile extends CollectionClass {
    constructor(document, schema) {
        super(document, schema)

        this.addFlux = async function (flux) {
            document.fluxes.push(flux.getID())
            document.markModified('fluxes');
            await this.save();
        }

        this.removeFlux = async function (flux) {

            // const docs = document.fluxes.filter((e) => {
            //
            //     console.log(e._id + ' === ' + flux.getID());
            //    return e._id.equals(flux.getID());
            // });
            document.fluxes.pull({ _id: flux.getID() });
            document.markModified('fluxes');
            console.log('removing');
            console.log(document.fluxes);
            await this.save();
            return true;
        }

        this.getObjectToSend = async function () {
            let profile = this.getObject();
            const {userKey, ...profileToSend} = {...profile};
            await document.populate('user');
            if (profileToSend.fluxes.length) {
                await document.populate('fluxes');
                await document.populate('fluxes.owner', 'user key');
                await document.populate('fluxes.owner.user', 'nickname')
                await document.populate('fluxes.clients', 'key timestamp_create user');
                await document.populate('fluxes.clients.user', 'nickname');
            }
            profileToSend.fluxes = [...document.fluxes];
            for (let i in profileToSend.fluxes) {
                let flux = profileToSend.fluxes[i];
                flux.mk = await node.collections.flux.manager.decodeMasterkey(flux.mk)
                if (flux.invite_key) flux.invite_key = await node.collections.flux.manager.decodeInviteKey(flux.invite_key);
                try {
                    profileToSend.fluxes[i].owner.user.nickname = await node.collections.user.manager.decodeIndex(flux.owner.user.nickname);
                    profileToSend.fluxes[i].owner.online = node.sockets.getByIndex('profileKey',flux.owner.key);
                    for (let e in flux.clients) {
                        let client = flux.clients[e];
                        if (client.user && client.user.nickname) {
                            if (client.user.nickname) {
                                profileToSend.fluxes[i].clients[e].user.nickname = await node.collections.user.manager.decodeIndex(client.user.nickname);
                            }
                            profileToSend.fluxes[i].clients[e].online = node.sockets.getByIndex('profileKey',client.key);
                        }
                    }
                }
                catch(e) {
                }
            }

            profileToSend.id = this.getID();
            profileToSend.nickname = await node.collections.user.manager.decodeIndex(document.user.nickname);
            delete profileToSend.user;
            // console.log('Profile to send :');
            // console.log(profileToSend);
            return profileToSend;
        }

        this.getProprietaryFreeFlux = async function () {
            const object = await this.getObjectToSend();
            let proprietary = [];
            object.fluxes.forEach((flux) => {
                if (flux.owner._id.equals(this.getID()) && flux.invite_key !== 'null') proprietary.push(flux);
            })
            return proprietary;
        }

        this.getAllFluxes = async function() {
            const object = await this.getObjectToSend();
            return object.fluxes;
        }

        this.setAllEventsReceived = async function() {
            await document.populate('fluxes');
            console.log('FOR ALL EVENT');
            for (let flux in document.fluxes) {
                let Flux = await node.collections.flux.manager.findByKey(document.fluxes[flux].key);
                Flux.setAllEventsReceivedForProfile(this.getKey())
                await Flux.save();
            }
            return true;
        }
    }
}

module.exports = Profile;
