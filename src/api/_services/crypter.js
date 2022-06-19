var jwtweb = require('jsonwebtoken'); // used to create, sign, and verify tokens
var crypto = require("crypto");
const webcrypto = require('@trust/webcrypto')
const CryptoJS = require("crypto-js");
// const KEY_TYPES= {
//     PBKDF2: "PBKDF2",
// }
//
// const TYPES_INTERNAL={
//
//     USER_DATA: ['DB_USER_DATA'],
// }
//


module.exports = {

    INTERNAL: {

        ENCODE(secret, data) {
            if (!secret.key || !secret.iv || !secret.salt || !data) {
                throw "Crypter.js: INTERNAL.ENCODE invalide secret token or data structure."
            }
            if (typeof (data) === "object" || typeof (data) === "array") {
                data = JSON.stringify(data);
            }
            let key = secret.key;
            let iv = secret.iv;
            let salt = secret.salt;

            key = crypto.pbkdf2Sync(key, salt, 2145, 32, 'sha512');
            const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
            const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
            const tag = cipher.getAuthTag();
            return Buffer.concat([tag, encrypted]).toString('base64');
        },

        DECODE(secret, data) {
            if (!secret.key || !secret.iv || !secret.salt || !data) {
                throw "Crypter.js: INTERNAL.DECDDE invalide secret token or data structure."
            }
            let key = secret.key;
            let iv = secret.iv;
            let salt = secret.salt;
            const bData = Buffer.from(data, 'base64');
            const tag = bData.slice(0, 16);
            const text = bData.slice(16);
            key = crypto.pbkdf2Sync(key, salt, 2145, 32, 'sha512');
            const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
            decipher.setAuthTag(tag);
            console.log(secret);
            console.log(data);
            let decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
            try {
                decrypted = JSON.parse(decrypted);
                return decrypted
            } catch {
                return decrypted;
            }

        }
    },
    PBKDF2: {
        GENERATE(key) {
            key = stringToBuffer(key);
            return webcrypto.subtle.importKey(
                'raw',
                key,
                {name: 'PBKDF2'},
                false,
                ['deriveBits', 'deriveKey']
            )
        },
        DERIVE_AESGCM(bufferKey, options) {
            return webcrypto.subtle.deriveKey(
                {
                    "name": 'PBKDF2',
                    "salt": options.salt || webcrypto.getRandomValues(new Uint8Array(16)),
                    "iterations": options.iterations || 100000,
                    "hash": 'SHA-512'
                },
                bufferKey,
                {"name": 'AES-GCM', "length": 256},
                options.extractable || false,
                options.function || ["encrypt", "decrypt"]
            )
        }
    },
    CBC: {
        ENCODE(key,data) {
           return CryptoJS.AES.encrypt(data, key).toString();
        },
        DECODE(key, data) {
            var bytes  = CryptoJS.AES.decrypt(data, key);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return originalText;
        },
    },
    JWT: {
        ENCODE(secret, data, expire = null) {
            let jwtoken;
            if (!expire) expire = "1d"
            jwtoken = jwtweb.sign(data, secret, {
                expiresIn: expire
            });
            return jwtoken;
        },

        DECODE(secret, data) {
            return jwtweb.verify(data, secret, function (err, decoded) {
                if (err) {
                    return false;
                } else {
                    return decoded;
                }
            })
        }
    },
    SALT: {
        PASSWORD(string) {
            string = crypto.createHash('md5').update(string).digest("hex");
            string = crypto.createHash('sha1').update(string).digest('hex');
            return string;
        }
    },
    RESALT: {
        PIN(string) {
            string = crypto.createHash('sha1').update(string).digest('hex');
            return string;
        }

    },
    B64: {

        ENCODE: function(string) {
            return Buffer.from(string).toString('base64');
        },

        DECODE: function(string) {
            return Buffer.from(string,'base64').toString('ascii');

        }
    }
}