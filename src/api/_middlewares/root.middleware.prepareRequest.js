
const xss = require('xss');
const CONFIG = require('../config.js')


module.exports = async function middleware_prepareRequest({ req, res, next }) {


    res.set('X-Powered-By','SuperNode');

    
    req.agent = {
        source: req.useragent.source,
        userAgent: req.useragent.browser,
        version: req.useragent.version,
        mobile: req.useragent.isMobile,
        host: req.headers.host,
        os: req.useragent.os,
        referer: req.headers.referer || null,
        hostname: req._parsedUrl.hostname || null,
        query: req.query,
        proxy: req.headers['x-forwarded-for'] || null,
        ip: req.connection.remoteAddress || null,
        lang: req.headers["accept-language"],
    };


    req.response = {
        object: {
            status: null,
            data: null,
            error: {},
        },
        add_error: function (index, msg = null) {
            if (!index) index = 'api'
            if (!msg) {
                msg = index;
                index = 'api'
            }
            if (!this.object.error[index]) this.object.error[index] = [];
            msg = msg['toJSON'] ? msg.toJSON() : msg
            this.object.error[index].push(msg);
        },
        get_error: function () { return this.object.error; },
        count_error: function () {
            return !!Object.keys(this.object.error).length;
        }
    }


    req.respond = function (data, status = null) {
        if (Object.keys(req.response.object.error).length) {
            if (!status) req.response.object.status = 403
            req.response.object.data = false;
        } else {
            req.response.object.status = status || 200;
            req.response.object.data = data || false;
        }
        if (!req.response.count_error()) {
            req.response.object.error = false
        }
        res.status(req.response.object.status);
        res.json(req.response.object);
        res.end();
    };

    req.print = function(index) {
        var lang = (ctx.req.headers["accept-language"]
        && ctx.req.headers["accept-language"] !== 'undefined'
            ? ctx.req.headers["accept-language"].split(',')[0]
            : CONFIG.langDefault);
        let o = lang.split('-');
        if (o.length > 1) lang = o[0];
        index = index.split('.') || index;
        let value = node.languages[lang] || false;
        if (value) {
            if (typeof (index) === "object") {
                for (let i in index) {
                    if (value[index[i]]) value = value[index[i]];
                }
            }
        }
        return value || index.join('.');
    }

    return await next();

    // ctx.req.response_header = {} //<--- Préparation du header de réponse
    // ctx.req.removeSession = async function(req) {
    //     delete ctx.req.response_header[X_SESSION];
    //     await OGS.$Collections.session.manager.delete(req);
    // }
    // ctx.req.createSession = async function(User, req) {
    //     if (ctx.req.headers[X_DEVICE]) {
    //         await OGS.$Collections.session.manager.register(User, req);
    //     }
    // }

    // // ***********************************
    // // *       SECURISATION POSTDATA     *
    // // ***********************************
    // for (let post in ctx.req.body) {
    //     if (typeof ctx.req.body[post] === 'string') ctx.req.body[post] = xss(ctx.req.body[post]);
    // }



    //     // ***********************************
    //     // *       HANDLER TOKEN X-SESSION    *
    //     // ***********************************
    //     let session = null;
    //     if (ctx.req.headers[X_SESSION] && ctx.req.headers[X_DEVICE]) {
    //         session = await OGS.$Collections.session.manager.verifyPayload(
    //             ctx.req,
    //             ctx.req.headers[X_DEVICE],
    //             OGS.$Services.crypter.JWT.DECODE(OGS.$Security.tokens[X_SESSION].key, ctx.req.headers[X_SESSION]),
    //         )
    //         if (!session) {
    //            await ctx.req.removeSession(ctx.req);
    //         } else {
    //             ctx.req.response_header[X_SESSION] = ctx.req.headers[X_SESSION];
    //             ctx.req.user = await OGS.$Collections.user.manager.findBySession(session);
    //         }
    //     } else {
    //        await ctx.req.removeSession(ctx.req);
    //     }

    // // ***********************************
    // // *      POST FACILITY REDUCTION    *
    // // ***********************************

    // ctx.req.agent = {
    //     source: ctx.req.useragent.source,
    //     userAgent: ctx.req.useragent.browser,
    //     version: ctx.req.useragent.version,
    //     mobile: ctx.req.useragent.isMobile,
    //     host: ctx.req.headers.host,
    //     os: ctx.req.useragent.os,
    //     referer: ctx.req.headers.referer || null,
    //     hostname: ctx.req._parsedUrl.hostname || null,
    //     method: ctx.req.method || null,
    //     url: ctx.req.url || null,
    //     query: ctx.req.query,
    //     proxy: ctx.req.headers['x-forwarded-for'] || null,
    //     ip: ctx.req.connection.remoteAddress || null,
    //     lang: ctx.req.headers["accept-language"],
    // };

    // ctx.req.xdevice = ctx.req.headers[X_DEVICE];
    // ctx.req.session = session || null;

    // // ***********************************
    // // *       PRINT FOR LANG GLOBAL     *
    // // ***********************************

    // ctx.req.print = function(index) {
    //     var lang = (ctx.req.headers["accept-language"]
    //     && ctx.req.headers["accept-language"] !== 'undefined'
    //         ? ctx.req.headers["accept-language"].split(',')[0]
    //         : CONFIG.langDefault);
    //     let o = lang.split('-');
    //     if (o.length > 1) lang = o[0];
    //     index = index.split('.') || index;
    //     let value = OGS.$Languages[lang] || false;
    //     if (value) {
    //         if (typeof (index) === "object") {
    //             for (let i in index) {
    //                 if (value[index[i]]) value = value[index[i]];
    //             }
    //         }
    //     }
    //     return value || index.join('.');
    // }

    // ctx.res.set(ctx.req.response_header);
    // await ctx.next();
}


