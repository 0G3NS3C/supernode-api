var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(manager) {
    return async function (Profile, token) {
        await Profile.addPushSubscription(token);
    }   
}
