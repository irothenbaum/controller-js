const SocketHelper = require('../helpers/socketHelper')
const { DataMessage } = require('../controller-js/heartbeatSocket')
const { Types } = require('../controller-js/events')

const CODE_LENGTH = 6

const ROLE_CONTROLLER = 'role-controller'
const ROLE_GAME = 'role-game'

class GameController {
    // One day we might allow either to initiate the connection, but right now the Game must initiate it
    static async socketGameInit(socket, req) {
        let code
        if (req.params.code) {
            // must meet our length requirements
            if (req.params.code.length < CODE_LENGTH) {
                throw new Error("Code too short")
            }

            // make sure this code isn't already in use
            let activeClient = SocketHelper.getActiveSocketByCode(req.params.code, ROLE_GAME)
            if (activeClient) {
                throw new Error("Code in use")
            }

            code = req.params.code
        } else {
            // generate a new code
            code = getRandomString(CODE_LENGTH)
        }

        // mark this socket
        SocketHelper.markSocketWithCode(socket, code, ROLE_GAME)

        // notify the game we're waiting for a controller to connect
        let successMessage = DataMessage.toSend(Types.CONNECTION.WAITING, {
            code: code
        })
        SocketHelper.pushToSocket(socket, successMessage)
    }

    // The controller must connect after the game
    static async socketConnectController(socket, req) {
        let activeGame = SocketHelper.getActiveSocketByCode(req.params.code, ROLE_GAME)
        if (!activeGame) {
            throw new Error("No game found")
        }

        let activeController = SocketHelper.getActiveSocketByCode(req.params.code, ROLE_CONTROLLER)

        if (activeController) {
            // One day we might add multiple controllers
            throw new Error("Currently only support for 1 controller")
        }

        // make this socket
        SocketHelper.markSocketWithCode(socket, req.params.code, ROLE_CONTROLLER)

        // connect them
        initiateHandshake(activeGame, socket)
    }
}

module.exports = GameController

/**
 * @param {number} count
 * @returns {string}
 */
function getRandomString(count) {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for ( let i = 0; i < count; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * @param {WebSocket} gameSocket
 * @param {WebSocket} controllerSocket
 */
function initiateHandshake(gameSocket, controllerSocket) {
    // they each just forward to the other socket
    controllerSocket.on('message', getHandler(gameSocket))
    gameSocket.on('message', getHandler(controllerSocket))

    // send them both a ready event
    let readyMessage = DataMessage.toSend(Types.CONNECTION.READY, {
        // can one day include data here (type of controller configuration?, account details?)
        dummy: "dummy"
    })
    SocketHelper.pushToSocket(controllerSocket, readyMessage)
    SocketHelper.pushToSocket(gameSocket, readyMessage)
}

/**
 * @param {WebSocket} other
 * @returns {Function}
 */
function getHandler(other) {
    return async function(msg) {
        let data = JSON.parse(msg)
        SocketHelper.pushToSocket(other, data)
    }
}