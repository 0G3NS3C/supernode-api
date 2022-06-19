

module.exports = function(manager) {
    return async function (userData) {
        delete userData.code;
        delete userData.iat;
        delete userData.exp;
        return await manager.create(userData);
        // const encryptedUserData = {};
        // for (const [key, value] of Object.entries(userData)) {
        //     if (key !== 'password') encryptedUserData[key] = OGS.$Services.crypter.INTERNAL.ENCODE(manager.SECRET.DB_USER,value);
        //     else encryptedUserData[key] = value;
        // }
        // try {
        //     userData = await manager.create(encryptedUserData);
        //     return userData;
        // }catch(e){
        //     return e
        // }
    }
}