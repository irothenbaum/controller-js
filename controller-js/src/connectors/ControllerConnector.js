const HeartbeatSocket = require('../HeartbeatSocket')
const SimpleObservable = require('../SimpleObservable')
const {
    Types,
    ButtonPressDownEvent,
    ButtonPressUpEvent,
    ConnectionInitEvent,
    JoystickMoveEndEvent,
    JoystickMoveEvent,
    JoystickMoveStartEvent
} = require('../Events')

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
        const initEvent = new ConnectionInitEvent(code)
        this.__connection.send(Types.CONNECTION.INIT, initEvent)
        this.trigger(Types.CONNECTION.INIT, initEvent)
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
        // could format an event payload given the data message type and payload

        this.trigger(dataMessage.type, dataMessage.payload)
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

    /**
     * @param {string} joystickCode
     */
    sendJoystickMoveStart(joystickCode) {
        let eventInstance = new JoystickMoveStartEvent(joystickCode)
        this.__connection.send(eventInstance.type, eventInstance)
    }

    /**
     * @param {string} joystickCode
     */
    sendJoystickMoveEnd(joystickCode) {
        let eventInstance = new JoystickMoveEndEvent(joystickCode)
        this.__connection.send(eventInstance.type, eventInstance)
    }

    /**
     * @param {string} joystickCode
     * @param {number} direction
     * @param {number} magnitude
     */
    sendJoystickMove(joystickCode, direction, magnitude) {
        let eventInstance = new JoystickMoveEvent(joystickCode, direction, magnitude)
        this.__connection.send(eventInstance.type, eventInstance)
    }
}

module.exports = ControllerConnector