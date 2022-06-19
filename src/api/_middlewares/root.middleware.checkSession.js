module.exports = async function checkSession({req, res, next}) {
   const X_DEVICE = node.security.tokens['x-device-jwt'];
   const X_SESSION = node.security.tokens['x-session-jwt'];

   const sessionToken = req.headers[X_SESSION.header];
   const deviceId = req.headers[X_DEVICE.header];

   if (sessionToken && deviceId) {
      const session = node.services.crypter.JWT.DECODE(X_SESSION.key, sessionToken, "365d");
      const trustedSession = await node.services.session.check(session, deviceId);
      if (trustedSession) {
         req.session = trustedSession;
         res.set(X_SESSION.header, sessionToken);
         next();
      }
      else {
            req.response.add_error('session','untrusted');
            return req.respond(false);   
      }
   }
   else {
      req.response.add_error('session','untrusted');
      return req.respond(false);
   }
}



