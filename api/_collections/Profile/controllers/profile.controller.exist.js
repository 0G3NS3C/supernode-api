module.exports = async ({ req , res , next }) => {
        console.log('profile exit controller');
        let Profile = await node.collections.profile.manager.findByUser(ctx.req.user);
        if (!Profile) ctx.req.respond(false);
        else {
                ctx.req.respond(true);
        }
}
