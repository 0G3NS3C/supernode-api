module.exports = async ({ req, res, next }) => {
   const X_DEVICE = node.security.tokens['x-device-jwt'];
   let device = null;
   let trustedDevice = null;

   try {
      device = JSON.parse(req.body.device);
      existDevice = await node.collections.device.manager.existDevice(device);
   }
   catch(e) {
      console.log(e);
      req.response.add_error('api','invalid_request');
      return req.respond(false);
   }

   if (existDevice) {
      trustedDevice = await node.collections.device.services.checkIntegrity(device,existDevice);
   }
   else {
      trustedDevice = await node.collections.device.manager.registerDevice(device);
   }
   if (!trustedDevice) {
      console.log('untrusted device');
      res.setHeader(X_DEVICE.header, null);
      return req.respond(false);
   }
   else {
      console.log('trusted device');
      res.setHeader(X_DEVICE.header, trustedDevice.getUniqID())
      return req.respond(true);
   }

}
