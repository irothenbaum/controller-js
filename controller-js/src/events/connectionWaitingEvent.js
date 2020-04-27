const Event = require('./event')
const Types = require('./types')

class ConnectionWaitingEvent extends Event {
    constructor(connectCode) {
        super(Types.CONNECTION.WAITING)
        this.connectCode = connectCode
    }
}

module.exports = ConnectionWaitingEvent