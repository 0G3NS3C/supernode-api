module.exports = function(manager) {
	return async function() {
		let invite_key = node.services.utils.randomToken(8).toUpperCase();
		invite_key = node.services.crypter.INTERNAL.ENCODE(manager.SECRET.DB_FLUX,invite_key)
        invite_key = node.services.crypter.B64.ENCODE(invite_key);
        return invite_key;
	}
}