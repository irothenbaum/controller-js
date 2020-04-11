const HeartbeatSocket = require('../heartbeatSocket')
const SimpleObservable = require('../simpleObservable')

const { DataMessage, HeartbeatConnectionError } = HeartbeatSocket

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
        this.__connection.send(GameConnector.EVENTS.CONNECTION.REQUEST, {
            code: code
        })
        this.trigger(GameConnector.EVENTS.CONNECTION.REQUEST)
    }

    async close() {
        if (this.__connection) {
            this.__connection.close()
            this.trigger(GameConnector.EVENTS.CONNECTION.CLOSE)
        }
    }
}

GameConnector.EVENTS = {
    GAME: {
        JOYSTICK: {
            MOVE: 'game:joystick:move',
            MOVE_START: 'game:joystick:move-start',
            MOVE_STOP: 'game:joystick:move-stop'
        },
        BUTTON: {
            PRESS: 'game:button:press',
            PRESS_DOWN: 'game:button:press-down',
            PRESS_UP: 'game:button:press-up'
        }
    },
    CONNECTION: {
        DENIED: 'connection:denied',
        REQUEST: 'connection:request',
        OPEN: 'connection:open',
        CLOSE: 'connection:close'
    }
}

module.exports = GameConnector