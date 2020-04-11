const Event = require('./event')
const Types = require('./types')

class ButtonPressEvent extends Event {
    code

    constructor(code) {
        super(Types.GAME.BUTTON.PRESS)
        this.code = code
    }
}

module.exports = ButtonPressEvent