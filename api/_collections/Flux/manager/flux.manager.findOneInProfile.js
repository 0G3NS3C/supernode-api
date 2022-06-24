module.exports = function (manager) {
    return async function (fluxKey, Profile) {

        let profile = await node.collections.profile.manager.getBase(Profile);
        profile = await node.collections.profile.manager.decodeBase(profile);

        const flux = profile.fluxes.find((e) => (e.key === fluxKey));
        if (flux) return flux;
        return false;

    }
}
