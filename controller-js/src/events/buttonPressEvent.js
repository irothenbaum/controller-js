const Event = require('./event')
const Types = require('./types')

class ButtonPressEvent extends Event {
    constructor(buttonCode) {
        super(Types.GAME.BUTTON.PRESS)
        this.buttonCode = buttonCode
    }
}

module.exports = ButtonPressEvent