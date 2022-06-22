module.exports = async ({ req , res , next }) => {
        let profile = await req.profile.getObjectToSend();
        return req.respond(profile);
}
