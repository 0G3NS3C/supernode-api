const dir_api = "api/"
const dir_default = "default/";
const path = require('path');

module.exports = {
    path: {
        api: path.normalize(__dirname + "../../../" + dir_api),
    },
    dir: {
        api: dir_api,
        versions: path.normalize(dir_api),
        databases: "_databases/",
        services: "_services/",
        langs: "_langs/",
        middlewares: "_middlewares/",
        class: "_class/",
        controllers: "_controllers/",
        collections: "_collections/",
        security: "_security/",
        sockets: "_sockets/",
        cache: ".cache/"
    },
    collections: {
        class: "class",
        schema: "schema.js",
        config: "config.js",
        router: "router.js",
        manager: 'manager',
        services: 'services',
        middlewares: 'middlewares',
        controllers: 'controllers'
    },
    sockets: {
        controllers: 'controllers',
        config: 'config.js',
    },
    security: {
        default: "_security/",
        tokens: "tokens/",
    },
    default: {
        js_export: dir_default + "default_js_export.js",
        js_export_ctx: dir_default + "default_js_export_ctx.js",
        js_api_config: dir_default + "default_js_api_config.js",
        json: dir_default + "default_json.json",
        json_routes: dir_default + "default_json_routes.json",
        middlewares: 'root',
    },

    file: {
        config: "config.js",
        env: 'env.json',
        router: 'router.js',
        bootstrap: 'bootstrap.js',
    },

    directive: {
        routes: {
            middlewares: "middlewares",
            controllers: "controllers"
        }
    }
}



