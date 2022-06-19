



module.exports = function (req, type = null) {
        let r;
        if (!type) type = node.services.device.types.WEB;
        if (type === node.services.device.types.WEB) {
            r = {
                browser: req.useragent.browser,
                version: req.useragent.version,
                os: req.useragent.os,
                mobile: req.useragent.isMobile,
                platform: req.useragent.platform || null,
                hostname: (req.ip && req.ip !== '::1') ? req.ip : req.hostname,
                ip: req.connection.remoteAddress,
                source: req.useragent.source,
            }
        }
        else if (type === node.services.device.types.PHONE) {
            r = {
                os: req.useragent.os,
                platform: req.useragent.platform || null,
                ip: req.connection.remoteAddress,
            }
        }
        return r;
    }