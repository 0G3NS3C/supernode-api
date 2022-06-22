module.exports = function(manager) {
	return async function() {
		let invite_key = node.services.utils.randomToken(8).toUpperCase();
		invite_key = await manager.encodeInviteKey(invite_key);
        return invite_key;
	}
}