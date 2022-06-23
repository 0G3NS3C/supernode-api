

module.exports = async function (requestDevice, existDevice) {
        const compareDevice = await existDevice.getObject();
        for (let index in requestDevice) {
            if (requestDevice[index] !== await compareDevice[index]) return false;
        }
        return existDevice;
    }
