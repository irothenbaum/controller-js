const Event = require('./Event')
const Types = require('./Types')

class ConnectionWaitingEvent extends Event {
    constructor(connectCode) {
        super(Types.CONNECTION.WAITING)
        this.connectCode = connectCode
    }
}

module.exports = ConnectionWaitingEvent