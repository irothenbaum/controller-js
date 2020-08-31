const Event = require('./Event')
const Types = require('./Types')

class ButtonPressDownEvent extends Event {
    constructor(buttonCode) {
        super(Types.GAME.BUTTON.PRESS_DOWN)
        this.buttonCode = buttonCode
    }
}

module.exports = ButtonPressDownEvent