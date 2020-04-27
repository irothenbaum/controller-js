module.exports = {
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
        HEARTBEAT: 'connection:heartbeat',
        INIT: 'connection:init',
        READY: 'connection:ready',
        WAITING: 'connection:waiting',
        CLOSE: 'connection:close'
    }
}