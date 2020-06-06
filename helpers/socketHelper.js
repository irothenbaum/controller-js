const socketServer = require('../socketServerSingleton')
const DataMessage = require('../controller-js/src/heartbeatSocket').DataMessage
const Types = require('../controller-js/src/events/types')

class GameMeta {
    constructor(code, role) {
        this.code = code;
        this.role = role;
    }

    /**
     * @param {GameMeta} meta
     */
    setOther(meta) {
        this._otherRole = meta.role
    }

    /**
     * @returns {GameMeta}
     */
    getOther() {
        return new GameMeta(this.code, this._otherRole)
    }
}

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
        socket._meta = new GameMeta(code, role)
    },

    /**
     * @param {WebSocket} socket
     */
    configureSocket(socket) {
        socket.on('message', async function(msg) {
            let data = DataMessage.fromReceived(msg)

            switch (data.type) {
                case Types.CONNECTION.HEARTBEAT:
                    SocketHelper.pushToSocket(socket, data)
                    break

                default:
                    // everything else, we forward to the "other"
                    let otherSocket = SocketHelper.getSocketFromGameMeta(socket._meta.getOther())
                    if (otherSocket) {
                        SocketHelper.pushToSocket(otherSocket, data)
                    }
                    break
            }
        })
    },

    /**
     * @param {GameMeta} other
     * @returns {WebSocket | null}
     */
    getSocketFromGameMeta(other) {
        if (!other || !other.code || !other.role) {
            return null
        }
        return SocketHelper.getActiveSocketByCode(other.code, other.role)
    },

    /**
     * @param {WebSocket} socket1
     * @param {WebSocket} socket2
     */
    markSocketsAsConnected(socket1, socket2) {
        socket1._meta.setOther(socket2._meta)
        socket2._meta.setOther(socket1._meta)
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

SocketHelper.GameMeta = GameMeta

module.exports = SocketHelper