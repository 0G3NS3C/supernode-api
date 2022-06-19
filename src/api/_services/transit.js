
 module.exports = {
        ENCODE: (data) => {
            const TRANSIT = node.security.tokens['transit-jwt'];
            return node.services.crypter.JWT.ENCODE(TRANSIT.key, data, '1d');
        },
        DECODE: (data) => {
            const TRANSIT = node.security.tokens['transit-jwt'];
            return node.services.crypter.JWT.DECODE(TRANSIT.key, data);
        }
    }