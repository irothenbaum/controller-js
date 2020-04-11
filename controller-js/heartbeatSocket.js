const Observable = require('./simpleObservable')

// 50 milliseconds
const QUEUE_CHECK_TIMEOUT = 50

// 1 === WebSocket.OPEN
const OPEN_STATE = 1

class HeartBeatSocket extends Observable {
    static EVENT_MESSAGE_SENT = 'message-sent' // data message payload
    static EVENT_MESSAGE_RECEIVED = 'message-received' // data message payload
    static EVENT_CONNECTION_OPENED = 'connection-opened' // no payload
    static EVENT_CONNECTION_CLOSED = 'connection-closed' // no payload
    static EVENT_CONNECTION_ERROR = 'connection-error' // error payload

    static TYPE_HEARTBEAT = 'heartbeat'

    /**
     * @param {string} url
     */
    constructor(url) {
        super()
        this.send = this.send.bind(this)

        this.__missedHeartbeats = 0
        this.__queue = []
        this.__socket = new WebSocket(url)
        this.__socket.onopen = this.init.bind(this)
        this.__socket.onmessage = this.__handleSocketMessage.bind(this)
    }

    init() {
        this.startHeartbeat(1000)
    }

    /**
     * @param {number} timeout
     * @protected
     */
    startHeartbeat(timeout) {
        // don't allow us to double-heartbeat
        if (this.__heartbeatInterval) {
            clearInterval(this.__heartbeatInterval)
        }

        this.__heartbeatInterval = setInterval(() => {
            try {
                this.__missedHeartbeats++
                if (this.__missedHeartbeats >= 3) {
                    throw new HeartbeatConnectionError("3 missed heartbeats")
                }
                this.send(HeartBeatSocket.TYPE_HEARTBEAT)
            } catch(e) {
                this.trigger(HeartBeatSocket.EVENT_CONNECTION_ERROR, e)
                this.close();
            }
        }, timeout)
    }

    /**
     * @param {string} type
     * @param {object?} data
     */
    send(type, data) {
        if (this.__socket.readyState !== OPEN_STATE) {
            this.__queue.push(arguments)
            this.__startQueue()
            return false
        } else {
            return this.__sendInternal(type, data)
        }
    }

    __handleSocketMessage({data}) {
        let dataObj = DataMessage.fromReceived(data)
        // trigger our internal event handlers
        this.trigger(HeartBeatSocket.EVENT_MESSAGE_RECEIVED, dataObj)
    }

    /**
     * @param {string} type
     * @param {object?} data
     */
    __sendInternal(type, data) {
        let dataMessage = DataMessage.toSend(type, data)
        this.__socket.send(JSON.stringify(dataMessage))
        this.trigger(HeartBeatSocket.EVENT_MESSAGE_SENT, dataMessage)
    }

    __startQueue() {
        if (this.__queueInterval) {
            // do nothing, it's already started
            return
        }

        this.__queueInterval = setInterval(() => {
            if (this.__socket.readyState === OPEN_STATE) {
                // it's open, no need to continue checking
                clearInterval(this.__queueInterval)
                delete this.__queueInterval

                // notify that we're open again
                this.trigger(HeartBeatSocket.EVENT_CONNECTION_OPENED)

                // if we have a queue, we need to start sending it
                if (this.__queue.length > 0) {
                    do {
                        // grab the oldest item in the queue
                        let args = this.__queue.shift()
                        // NOTE: we call send not sendInternal because it could potentially die again
                        // If it does die again, the queue will restart and that item will be back at the end.
                        // so, while not ideal because it loses its place in line, it will properly prevent duplicates + dropped messages
                        this.send(args[0], args[1])

                    } while (this.__queue.length > 0 && this.__socket.readyState === OPEN_STATE)

                    // if we broke our loop because it died again, we need to re-start the poll
                    // NOTE: This is only *needed* if it dies in the microsecond between the last send(...) and the while condition check
                    // because if the send(...) failed it would have already started again
                    if (this.__socket.readyState !== OPEN_STATE && this.__queue.length > 0) {
                        this.__startQueue()
                    }
                }
            }
        }, QUEUE_CHECK_TIMEOUT)
    }

    close() {
        clearInterval(this.__heartbeatInterval)
        delete this.__heartbeatInterval

        clearInterval(this.__queueInterval)
        delete this.__queueInterval

        this.__socket.close()
        this.trigger(HeartBeatSocket.EVENT_CONNECTION_CLOSED)
    }
}

// ----------------------------------------------------------------------------------------

class DataMessage {
    type
    timestamp_sent
    timestamp_received
    payload

    /**
     * @param {string} type
     * @param {*} payload
     * @returns {DataMessage}
     */
    static toSend(type, payload) {
        let retVal = new DataMessage()
        retVal.type = type
        retVal.payload = payload
        retVal.timestamp_sent = Date.now()
        return retVal
    }

    /**
     * @param {string} jsonString
     * @returns {DataMessage}
     */
    static fromReceived(jsonString) {
        let data = JSON.parse(jsonString)
        let retVal = new DataMessage()
        retVal.type = data.type
        retVal.payload = data.payload
        retVal.timestamp_sent = data.timestamp_sent
        retVal.timestamp_received = Date.now()
        return retVal
    }
}

// ----------------------------------------------------------------------------------------

class HeartbeatConnectionError extends Error {}

// ----------------------------------------------------------------------------------------


HeartBeatSocket.HeartbeatConnectionError = HeartbeatConnectionError
HeartBeatSocket.DataMessage = DataMessage
module.exports = HeartBeatSocket
