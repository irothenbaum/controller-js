const HeartbeatSocket = require('../HeartbeatSocket')
const SimpleObservable = require('../SimpleObservable')
const {
    ButtonPressDownEvent,
    ButtonPressUpEvent,
    ConnectionReadyEvent,
    ConnectionInitEvent,
    ConnectionWaitingEvent,
    JoystickMoveStartEvent,
    JoystickMoveEvent,
    JoystickMoveEndEvent,
    Types,
} = require('../Events')

const { DataMessage } = HeartbeatSocket

class GameConnector extends SimpleObservable {
    constructor() {
        super()

        this.__handleDataMessage = this.__handleDataMessage.bind(this)
    }

    /**
     * @param {string} endpoint
     * @param {string?} code
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
        let event

        // build the correct event object given the type
        switch (dataMessage.type) {
            case Types.GAME.BUTTON.PRESS_DOWN:
                event = new ButtonPressDownEvent(dataMessage.payload.buttonCode)
                break

            case Types.GAME.BUTTON.PRESS_UP:
                event = new ButtonPressUpEvent(dataMessage.payload.buttonCode)
                break

            case Types.GAME.JOYSTICK.MOVE_START:
                event = new JoystickMoveStartEvent(dataMessage.payload.joystickCode)
                break

            case Types.GAME.JOYSTICK.MOVE_END:
                event = new JoystickMoveEndEvent(dataMessage.payload.joystickCode)
                break

            case Types.GAME.JOYSTICK.MOVE:
                event = new JoystickMoveEvent(dataMessage.payload.joystickCode, dataMessage.payload.direction, dataMessage.payload.magnitude)
                break

            case Types.CONNECTION.WAITING:
                event = new ConnectionWaitingEvent(dataMessage.payload.connectCode)
                break

            case Types.CONNECTION.INIT:
                event = new ConnectionInitEvent(dataMessage.payload.connectCode)
                break

            case Types.CONNECTION.HEARTBEAT:
                // do nothing
                break

            case Types.CONNECTION.READY:
                event = new ConnectionReadyEvent()
                break

            default:
                console.log("Unrecognized Event Type: " + dataMessage.type)
        }

        if (event) {
            event.timestamp = dataMessage.timestamp_sent
            // broadcast the event
            this.trigger(dataMessage.type, event)
        }

    }
}

module.exports = GameConnector