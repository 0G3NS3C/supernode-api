

module.exports = function(manager) {
    return async function (userData) {
        delete userData.code;
        delete userData.iat;
        delete userData.exp;
        const encryptedUserData = {};
        for (const [key, value] of Object.entries(userData)) {
            if (key !== 'password') encryptedUserData[key] = await node.collections.user.manager.encodeIndex(value);

            else encryptedUserData[key] = value;
        }
        try {
            userData = await manager.create(encryptedUserData);
            return userData;
        }catch(e){
            return e
        }
    }
}