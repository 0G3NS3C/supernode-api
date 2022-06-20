module.exports = async function checkDevice({ req, res, next }) {

   const X_DEVICE = node.security.tokens['x-device-jwt'];
   
   if (req.headers[X_DEVICE.header]) {
      const device = await node.collections.device.manager.getByUniqID(req.headers[X_DEVICE.header]);
      if (device) {
         res.set(X_DEVICE.header, req.headers[X_DEVICE.header])
         req.device = device;
         return await next();
      } 
      else {
         req.response.add_error('api', 'untrusted_device');
         return req.respond(false);
      }
   } 
   else {
         req.response.add_error('api', 'untrusted_device');
         return req.respond(false);   
   }
}



