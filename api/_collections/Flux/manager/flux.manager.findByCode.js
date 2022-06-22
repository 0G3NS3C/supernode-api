
module.exports = function (manager) {
    return async function (code, profile) {
        console.log('code : ');
        console.log(code);
        console.log(manager);
        let flux = await manager.findOne({
            invite_key: await manager.encodeInviteKey(code),
            owner: {
                $ne: profile.getID(),
            },
        });
        return flux;


    }
}
