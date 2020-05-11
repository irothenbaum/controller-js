const Event = require('./event')
const Types = require('./types')

class ButtonPressDownEvent extends Event {
    constructor(buttonCode) {
        super(Types.GAME.BUTTON.PRESS_DOWN)
        this.buttonCode = buttonCode
    }
}

module.exports = ButtonPressDownEvent