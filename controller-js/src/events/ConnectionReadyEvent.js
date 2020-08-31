const Event = require('./Event')
const Types = require('./Types')

class ConnectionReadyEvent extends Event {
    constructor() {
        super(Types.CONNECTION.READY)

        // TODO: What should we include in this event?
    }
}

module.exports = ConnectionReadyEvent