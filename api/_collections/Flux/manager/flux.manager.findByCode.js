
module.exports = function (manager) {
    return async function (code, profile) {
        console.log('code : ');
        console.log(code);
        let flux = await manager.findOne({
            invite_key: code,
            owner: {
                $ne: profile.getID(),
            },
        });
        return flux;


    }
}
