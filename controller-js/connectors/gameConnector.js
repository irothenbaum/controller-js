const HeartbeatSocket = require('../heartbeatSocket')
const SimpleObservable = require('../simpleObservable')
const EVENTS = require('../events')

const { DataMessage, HeartbeatConnectionError } = HeartbeatSocket

class GameConnector extends SimpleObservable {
    constructor() {
        super()
    }

    /**
     * @param {string} endpoint
     * @param {string?} code
     * @returns {Promise<void>}
     */
    async init(endpoint, code) {
        this.close()
        this.__connection = new HeartbeatSocket(endpoint)
        this.__connection.on(HeartbeatSocket.EVENT_MESSAGE_RECEIVED, this.__handleDataMessage)
        this.__connection.send(EVENTS.CONNECTION.REQUEST, {
            code: code
        })
        this.trigger(EVENTS.CONNECTION.REQUEST)
    }

    async close() {
        if (this.__connection) {
            this.__connection.close()
            this.trigger(EVENTS.CONNECTION.CLOSE)
        }
    }

    /**
     * @param {DataMessage} dataMessage
     * @private
     */
    __handleDataMessage(dataMessage) {
        this.trigger(dataMessage.type, dataMessage.payload)
    }
}

module.exports = GameConnector