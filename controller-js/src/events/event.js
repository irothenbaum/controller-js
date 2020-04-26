class Event {
    constructor(type) {
        this.type = type
        this.timestamp = Date.now()
    }
}

module.exports = Event