
module.exports = function (manager) {
    return  function () {
        return node.services.utils.randomToken(manager.OPTIONS.MASTERKEYLENGTH);
    }
}
