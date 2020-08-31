const Event = require('./Event')
const Types = require('./Types')

class JoystickMoveStartEvent extends Event {
    constructor(joystickCode) {
        super(Types.GAME.JOYSTICK.MOVE_START)
        this.joystickCode = joystickCode
    }
}

module.exports = JoystickMoveStartEvent