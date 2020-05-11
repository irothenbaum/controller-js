const HeartbeatSocket = require('../heartbeatSocket')
const SimpleObservable = require('../simpleObservable')
const {Types, ButtonPressDownEvent, ButtonPressUpEvent} = require('../events')

const { DataMessage } = HeartbeatSocket

class ControllerConnector extends SimpleObservable {
    constructor() {
        super()

        this.__handleDataMessage = this.__handleDataMessage.bind(this)
    }

    /**
     * @param {string} endpoint
     * @param {string} code
     * @returns {Promise<void>}
     */
    async init(endpoint, code) {
        this.close()
        this.__connection = new HeartbeatSocket(endpoint, Types.CONNECTION.HEARTBEAT)
        this.__connection.on(HeartbeatSocket.EVENT_MESSAGE_RECEIVED, this.__handleDataMessage)
        this.__connection.on(HeartbeatSocket.EVENT_CONNECTION_ERROR, error => {
            console.error(error)
        })
        this.__connection.on(HeartbeatSocket.EVENT_CONNECTION_CLOSED, () => {
            console.log("CONNECTION CLOSED")
        })
        this.__connection.send(Types.CONNECTION.INIT, {
            code: code
        })
        this.trigger(Types.CONNECTION.INIT)
    }

    async close() {
        if (this.__connection) {
            this.__connection.close()
            this.trigger(Types.CONNECTION.CLOSE)
        }
    }

    /**
     * @private
     * @param {DataMessage} dataMessage
     */
    __handleDataMessage(dataMessage) {
        // could format an event payload given the datamessage type and payload

        this.trigger(dataMessage.type)
    }

    /**
     * @param {string} buttonCode
     */
    sendButtonPressDown(buttonCode) {
        let eventInstance = new ButtonPressDownEvent(buttonCode)
        this.__connection.send(eventInstance.type, eventInstance)
    }

    /**
     * @param {string} buttonCode
     */
    sendButtonPressUp(buttonCode) {
        let eventInstance = new ButtonPressUpEvent(buttonCode)
        this.__connection.send(eventInstance.type, eventInstance)
    }

    sendJoystickMoveStart() {

    }

    sendJoystickMoveStop() {

    }

    sendJoystickMove() {

    }
}

module.exports = ControllerConnector