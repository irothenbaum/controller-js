const HeartbeatSocket = require('../heartbeatSocket')
const SimpleObservable = require('../simpleObservable')
const {Types, ButtonPressEvent} = require('../events')

class ControllerConnector extends SimpleObservable {
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
        this.__connection.init()
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

    sendButtonPressDown() {

    }

    /**
     * @param {string} code
     */
    sendButtonPress(code) {
        let eventInstance = new ButtonPressEvent(code)
        this.__connection.send(Types.GAME.BUTTON.PRESS_UP, eventInstance)
    }

    sendButtonPressUp() {

    }

    sendJoystickMoveStart() {

    }

    sendJoystickMoveStop() {

    }

    sendJoystickMove() {

    }
}

module.exports = ControllerConnector