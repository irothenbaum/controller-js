class Event {
    type
    timestamp

    constructor(type) {
        this.type = type
        this.timestamp = Date.now()
    }
}

module.exports = Event