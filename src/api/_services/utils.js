const {capitalizeFirstLetter} = require('../../server/utils.js');

module.exports = {
    capitalizeFirstLetter,
    generateCodeRegister(length) {
        length=length||6;
        var char = "0123456789";
        var charL = char.length, result='';
        for ( var i = 0; i < length; i++ ) {
            result += char.charAt(Math.floor(Math.random() * charL));
        }
        return result
    },
    randomToken(length) {
        length=length||6;
        var char = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var charL = char.length, result='';
        for ( var i = 0; i < length; i++ ) {
            result += char.charAt(Math.floor(Math.random() * charL));
        }
        return result
    },
    validateNickname(name) {
        var ref = /^[a-z0-9_\s]+$/i
        return ref.test(String(name).toLowerCase())
    },
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    },

    validateNumber(country, number) {
        if (country == 'fr') {
            if (number > 100000000 && number < 999999999) {
                return true
            } else {
                return false
            }
        }
    },
    validatePassword(string) { /* 1 maj, 1 min, 1 number, 8 caracters */
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return re.test(string);
    },
    formatStringToURL(string) {
        url = string;
        url = url.replace('#ç#', 'c');
        url = url.replace('#è|é|ê|ë#', 'e');
        url = url.replace('#È|É|Ê|Ë#', 'E');
        url = url.replace('#à|á|â|ã|ä|å#', 'a');
        url = url.replace('#@|À|Á|Â|Ã|Ä|Å#', 'A');
        url = url.replace('#ì|í|î|ï#', 'i');
        url = url.replace('#Ì|Í|Î|Ï#', 'I');
        url = url.replace('#ð|ò|ó|ô|õ|ö#', 'o');
        url = url.replace('/\(|\)/', '');
        url = url.replace('#&#', '');
        url = url.replace('#gt;#', '');
        url = url.replace('#Ò|Ó|Ô|Õ|Ö|ô#', 'O');
        url = url.replace('#ù|ú|û|ü#', 'u');
        url = url.replace('#Ù|Ú|Û|Ü#', 'U');
        url = url.replace('#ý|ÿ#', 'y');
        url = url.replace('/\s+/', '-');
        url = url.replace('/\//', '');
        url = url.replace('#>#', '_');
        url = url.replace('#<#', '_');
        url = url.replace('#__#', '_');
        url = url.replace([':', '\'', '!', '.', ',', '::'], '');
        url = url.replace(' ', '_');
        url = url.replace(/[^\w\s]/gi, '')
        return url;
    },
    arrayBufferToBase64String(arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer)
        var byteString = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
            byteString += String.fromCharCode(byteArray[i]);
        }
        return btoa(byteString);
    },
    base64StringToArrayBuffer(b64str) {
        var byteStr = self.atob(b64str);
        var bytes = new Uint8Array(byteStr.length);
        for (var i = 0; i < byteStr.length; i++) {
            bytes[i] = byteStr.charCodeAt(i);
        }
        return bytes.buffer;
    },
    textToArrayBuffer(str) {
        var buf = self.unescape(encodeURIComponent(str)); // 2 bytes for each char
        var bufView = new Uint8Array(buf.length);
        for (var i = 0; i < buf.length; i++) {
            bufView[i] = buf.charCodeAt(i);
        }
        return bufView;
    },
    Uint8ArrayToBuffer(array) {
        return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
    },
    convertBufferToHex(arr) {
        let i,
            len,
            hex = '',
            c
        for (i = 0, len = arr.length; i < len; i += 1) {
            c = arr[i].toString(16)
            if (c.length < 2) {
                c = '0' + c
            }
            hex += c
        }
        return hex
    },
    convertHexToBuffer(hex) {
        let i,
            byteLen = hex.length / 2,
            arr,
            j = 0
        if (byteLen !== parseInt(byteLen, 10)) {
            throw new Error("Invalid hex length '" + hex.length + "'")
        }
        arr = new Uint8Array(byteLen)
        for (i = 0; i < byteLen; i += 1) {
            arr[i] = parseInt(hex[j] + hex[j + 1], 16)
            j += 2
        }
        return arr
    },
// compare ArrayBuffers
    arrayBuffersAreEqual(a, b) {
        return dataViewsAreEqual(new DataView(a), new DataView(b));
    },
// compare DataViews
    dataViewsAreEqual(a, b) {
        if (a.byteLength !== b.byteLength) return false;
        for (let i = 0; i < a.byteLength; i++) {
            if (a.getUint8(i) !== b.getUint8(i)) return false;
        }
        return true;
    },
// compare TypedArrays
    typedArraysAreEqual(a, b) {
        if (a.byteLength !== b.byteLength) return false;
        return a.every((val, i) => val === b[i]);
    },
    stringToBuffer(str) {
        return new TextEncoder().encode(str)
    },
    bufferToString(buf) {
        return new TextDecoder().decode(buf)
    },
}