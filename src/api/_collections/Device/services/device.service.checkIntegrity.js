

module.exports = async function (requestDevice, existDevice) {
        for (let index in requestDevice) {
            if (requestDevice[index] !== existDevice.getObject()[index]) return false;
        }
        return existDevice;
    }
