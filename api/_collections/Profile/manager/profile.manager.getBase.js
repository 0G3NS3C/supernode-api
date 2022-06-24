var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(manager) {
    return async function (Profile) {
        
        const base = {};

        base.id = await Profile.getID();
        base.key = await Profile.getKey();
        base.nickname = await Profile.getNickname();
        base.fluxes = await Profile.getFluxes();

        return base;
    }
}
