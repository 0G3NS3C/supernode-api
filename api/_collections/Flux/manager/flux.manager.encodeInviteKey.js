module.exports = function(manager) {
	return async function(key) {
		key = node.services.crypter.INTERNAL.ENCODE(manager.SECRET.DB_FLUX,key)
        return key;
	}
}