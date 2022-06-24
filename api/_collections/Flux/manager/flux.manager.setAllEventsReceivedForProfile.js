module.exports = function (manager) {
    return async function (profile) {

        let profileFluxList = await profile.getFluxes();
        for (let flux of profileFluxList) {
            let Flux = await node.collections.flux.manager.findByKey(flux.key);
            await Flux.setAllEventsReceivedForProfile(profile);
        }
    }
}
