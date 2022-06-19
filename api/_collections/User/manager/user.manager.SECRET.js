module.exports = function (manager) {
    return {
        DB_USER: node.security.tokens['db-user-aes']
    };
}
