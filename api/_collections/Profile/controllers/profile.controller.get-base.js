module.exports = async ({ req , res , next }) => {
        let profile = await node.collections.profile.manager.getBase(req.profile);
        profile = await node.collections.profile.manager.decodeBase(profile);
        // node.services.expo.sendNotification(await req.profile.getNotificationsTokens(), 'Quiet', 'Vous êtes maintenant connecté');
        return req.respond(profile);
}
