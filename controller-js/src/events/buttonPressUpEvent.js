const Event = require('./event')
const Types = require('./types')

class ButtonPressUpEvent extends Event {
    constructor(buttonCode) {
        super(Types.GAME.BUTTON.PRESS_UP)
        this.buttonCode = buttonCode
    }
}

module.exports = ButtonPressUpEvent