const Event = require('./Event')
const Types = require('./Types')

class ConnectionInitEvent extends Event {
    constructor(code) {
        super(Types.CONNECTION.INIT)

        this.code = code
    }
}

module.exports = ConnectionInitEvent