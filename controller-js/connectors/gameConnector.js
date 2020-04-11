const HeartbeatSocket = require('../heartbeatSocket')
const SimpleObservable = require('../simpleObservable')
const {Types, ButtonPressEvent} = require('../events')

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
        this.__connection.send(Types.CONNECTION.REQUEST, {
            code: code
        })
        this.trigger(Types.CONNECTION.REQUEST)
    }

    async close() {
        if (this.__connection) {
            this.__connection.close()
            this.trigger(Types.CONNECTION.CLOSE)
        }
    }

    /**
     * @param {DataMessage} dataMessage
     * @private
     */
    __handleDataMessage(dataMessage) {
        switch (dataMessage.type) {
            case Types.GAME.BUTTON.PRESS:
                let event = ButtonPressEvent(dataMessage.payload.code)
                event.timestamp = dataMessage.payload.timestamp
                return event
        }
    }
}

module.exports = GameConnector