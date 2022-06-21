const CollectionClass = require('../../../../src/collection/CollectionClass.js');

class Flux extends CollectionClass {
    constructor(document, schema) {
        super(document, schema)
        this.decodedMK = false;
        this.addClient = async function (profile) {
            if (!document.clients.find((e) => e === profile.getID())) {
                console.log('ADDING CLIENT');
                document.clients.push(profile.getDocumentModel())
                document.markModified('clients');
                await this.save();
            }
        }

        this.deleteInviteKey = async function(profile) {
            document.invite_key = undefined;
            document.markModified('invite_key');
            await this.save();
        }
        this.addEventClient = async function(event) {
            document.events.push(event);
            document.markModified('events');
            await this.save();
            return document.events[document.events.length - 1];
        }

        this.setAllEventsReceivedForProfile = function(profileKey) {
            for (let event in document.events) {
                if ( document.events[event].originId !== profileKey && document.events[event].status < 6) {
                    document.events[event].status = 6
                }
            }
            document.markModified('events');
        }

        this.updateEvent = async function(event, key, value) {
            let index = document.events.findIndex((e) => e.key === event.key);
            try {
                document.events[index][key] = value
                document.markModified('events');
                await this.save();
                return true;
            }
            catch(e) { return true; }
        }

        this.deleteEvent = async function(event) {
            console.log('=> DELETE EVENT ');
            const events = document.events.filter((e) => e.key !== event.key)
            document.events = events;
            document.markModified('events')
            await this.save();
            return true;
        }
        this.eject = async function(askerProfile) {
            await document.populate('owner', 'key');
            await document.populate('clients', 'key');

            if (document.owner.key === askerProfile.getKey()) {
                if (this.getType() === OGS.$Collections.flux.manager.TYPES.BIDIRECTIONAL) {
                    for (let client of document.clients) {
                        const profile = await node.collections.profile.manager.findByKey(client.key);
                        if (profile) {
                            console.log('PROFILE ==================');
                            await profile.removeFlux(this);
                        }
                    }
                    document.clients = [];
                    document.events = [];
                }
            }
            else {
                document.clients = document.clients.filter((e) => (e.key !== askerProfile.getKey()));
                document.events = [];
                await askerProfile.removeFlux(this);
            }
            document.markModified('clients');
            document.markModified('events');
        }

        this.reinitialisation = async function() {
            document.invite_key = node.services.utils.randomToken(4)+'-'+node.services.utils.randomToken(4)+'-'+node.services.utils.randomToken(4)
            let masterkey = node.collections.flux.manager.createMasterkey();
            masterkey = await node.collections.flux.manager.encodeMasterkey(masterkey);
            masterkey = node.services.crypter.INTERNAL.ENCODE(node.collections.flux.manager.SECRET.DB_FLUX,masterkey)
            masterkey = node.services.crypter.B64.ENCODE(masterkey);
            document.masterkey = masterkey;
            this.decodedMK = false;

            console.log(document.invite_key);
        }

        this.getObjectToSend = async function() {
            await document.populate('owner', 'user');
            await document.populate('owner.user', 'nickname')
            await document.populate('clients', 'key timestamp_create user');
            await document.populate('clients.user', 'nickname');
            let flux = this.getObject();
           // flux.owner.user.nickname = await node.collections.user.manager.decodeIndex(flux.owner.user.nickname);
            flux.owner.online = node.sockets._isOnlineProfile(flux.owner.key);
            for (let e in flux.clients) {
                let client = flux.clients[e];
                if (client.user && client.user.nickname) {
                    if (client.user.nickname) {
                      //  flux.clients[e].user.nickname = await node.collections.user.manager.decodeIndex(client.user.nickname);
                    }
                    flux.clients[e].online = node.sockets._isOnlineProfile(client.key);
                }
            }
           if (!this.decodedMK) {
               flux.mk = await node.collections.flux.manager.decodeMasterkey(flux.mk);
               this.decodedMK = true;
           }

            return flux;
        }

        this.isOwner = async function(ProfileKey) {
            console.log('IS OWNER');
            await document.populate('owner');
            if (document.owner.key === ProfileKey) return true;
            else return
        }   

        this.isClient = async function(ProfileKey) {
            await document.populate('clients','key');
            for (let client of document.clients) {
                if (client.key === ProfileKey) return true;
            }
            return false;
        }   

        this.save = async function() {
            try {
                if (document.invite_key === 'null' ||document.invite_key === '{}')  document.invite_key = 'null';
                await document.save();
            } catch(e) {

            }

        }
    }
}

module.exports =  Flux;
