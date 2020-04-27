const Event = require('./event')
const Types = require('./types')

class ConnectionReadyEvent extends Event {
    constructor() {
        super(Types.CONNECTION.READY)

        // TODO: What should we include in this event?
    }
}

module.exports = ConnectionReadyEvent