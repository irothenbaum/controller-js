const socketServer = require('../socketServerSingleton')

const SocketHelper = {

    SOCKET_OPEN: 1,

    /**
     * @returns {Array}
     */
    getClients() {
        // wss.clients is a set, not an array. But I like arrays
        /** @type {Set} clients */
        let clients = socketServer().getWss().clients
        return Array.from(clients)
    },

    /**
     * @param {string} code
     * @param {string} role
     * @returns {Array<WebSocket>}
     */
    getActiveSocketByCode(code, role) {
        return SocketHelper.getClients().find(s =>  {
            return s.readyState === SocketHelper.SOCKET_OPEN
                && s._meta
                && s._meta.code === code
                && s._meta.role === role
        })
    },

    /**
     * @param {WebSocket} socket
     * @param {string} code
     * @param {string} role
     */
    markSocketWithCode(socket, code, role) {
        socket._meta = {
            code: code,
            role: role
        }
    },

    /**
     * @param {WebSocket} socket
     * @param {*} dataMessage
     */
    pushToSocket(socket, dataMessage) {
        // only push to active sockets
        if (socket.readyState === SocketHelper.SOCKET_OPEN) {
            socket.send(JSON.stringify(dataMessage))
        }
    }
}

module.exports = SocketHelper