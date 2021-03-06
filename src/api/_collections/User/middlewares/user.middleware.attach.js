var ObjectId = require('mongoose').Types.ObjectId;

module.exports = async function attach({ req, res, next }) {
   if (req.session) {
      const User = await node.collections.user.manager.findOne({ _id : new ObjectId(req.session.getUserId()) })
      if (User) {
         req.user = User;
         return await next();
      }
      else {
         return req.respond(false);
      }
   } else {
      return req.respond(false);
   }

}

