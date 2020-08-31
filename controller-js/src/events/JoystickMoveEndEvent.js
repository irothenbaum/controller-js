const Event = require('./Event')
const Types = require('./Types')

class JoystickMoveEndEvent extends Event {
    constructor(joystickCode) {
        super(Types.GAME.JOYSTICK.MOVE_END)
        this.joystickCode = joystickCode
    }
}

module.exports = JoystickMoveEndEvent