

module.exports = function(manager) {
    return async function (data) {
        console.log('client manager test()');
        return data;
    }
}