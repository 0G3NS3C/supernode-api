

module.exports = function({ node }) {
    return async function () {
        console.log('client service otherExample()');
        return true;
    }
}