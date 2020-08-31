const Event = require('./Event')
const Types = require('./Types')

class ButtonPressUpEvent extends Event {
    constructor(buttonCode) {
        super(Types.GAME.BUTTON.PRESS_UP)
        this.buttonCode = buttonCode
    }
}

module.exports = ButtonPressUpEvent