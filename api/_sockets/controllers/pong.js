module.exports = async (socket, req, data) => {


    if (!socket.isAlive) socket.isAlive = true;

    clearTimeout(socket.timeoutPing);
    clearTimeout(socket.timeoutDisconnect);

    socket.timeoutPing = setTimeout(function() {
            socket._send({
                type: 'ping'
            })
            socket.timeoutDisconnect = setTimeout(function() {
                socket.isAlive = false;
            },3000)

    },5000)

}
