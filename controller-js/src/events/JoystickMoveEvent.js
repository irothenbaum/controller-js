const Event = require('./Event')
const Types = require('./Types')

class JoystickMoveEvent extends Event {
    constructor(joystickCode, direction, magnitude) {
        super(Types.GAME.JOYSTICK.MOVE)
        this.joystickCode = joystickCode
        this.direction = direction
        this.magnitude = magnitude
    }
}

module.exports = JoystickMoveEvent