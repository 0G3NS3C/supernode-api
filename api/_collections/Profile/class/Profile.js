const CollectionClass = require('../../../../src/collection/CollectionClass.js');

class Profile extends CollectionClass {
    constructor(document, schema) {
        super(document, schema)

        this.getFluxes = async function() {
            await document.populate('fluxes');
            await document.populate('fluxes.owner', 'user key');
            await document.populate('fluxes.owner.user', 'nickname');
            await document.populate('fluxes.clients', 'key timestamp_create user');
            await document.populate('fluxes.clients.user', 'nickname');
            return document.fluxes;
        }

        this.getNickname = async function() {
            await document.populate('user','nickname');
            return document.user.nickname;
        }

        this.addFlux = async function (flux) {
            document.fluxes.push(flux.getID())
            document.markModified('fluxes');
            await this.save();
            return true;
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

        this.getProprietaryFreeFlux = async function () {
            const fluxes = await this.getFluxes();
            let proprietary = [];
            fluxes.forEach((flux) => {
                if (flux.owner._id.equals(this.getID()) && flux.invite_key) proprietary.push(flux);
            })
            return proprietary;
        }

        this.setAllEventsReceived = async function() {
            await document.populate('fluxes');
            for (let flux in document.fluxes) {
                let Flux = await node.collections.flux.manager.findByKey(document.fluxes[flux].key);
                await Flux.setAllEventsReceivedForProfile(this.getKey())
                await Flux.save();
            }
            return true;
        }
    }
}

module.exports = Profile;
