const SocketHelper = require('../helpers/socketHelper')
const DataMessage = require('../controller-js/src/heartbeatSocket').DataMessage
const Types  = require('../controller-js/src/events/types')
const TwigRender = require('../helpers/twigRender')


const CODE_LENGTH = 6

const ROLE_CONTROLLER = 'role-controller'
const ROLE_GAME = 'role-game'

class GameController {
    static async getControllerPage(req, res, next) {
        TwigRender(res, 'controller')
    }

    // One day we might allow either to initiate the connection, but right now the Game must initiate it
    static socketGameInit(socket, req) {
        let connectCode
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

            connectCode = req.params.code
        } else {
            // generate a new code
            connectCode = getRandomString(CODE_LENGTH)
        }

        // mark this socket
        SocketHelper.markSocketWithCode(socket, connectCode, ROLE_GAME)

        // configure our server side handling
        SocketHelper.configureSocket(socket)

        // notify the game we're waiting for a controller to connect
        let successMessage = DataMessage.toSend(Types.CONNECTION.WAITING, {
            connectCode: connectCode
        })
        SocketHelper.pushToSocket(socket, successMessage)
    }

    // The controller must connect after the game
    static socketConnectController(socket, req) {
        // TODO: We should handle this connection stuff when we receive the "INIT" event
        let activeGame = SocketHelper.getActiveSocketByCode(req.params.code, ROLE_GAME)
        if (!activeGame) {
            console.log("ERROR! no game")
            throw new Error("No game found")
        }

        let activeController = SocketHelper.getActiveSocketByCode(req.params.code, ROLE_CONTROLLER)

        if (activeController) {
            console.log("ERROR! already controller")
            // One day we might add multiple controllers
            throw new Error("Currently only support for 1 controller")
        }

        // make this socket
        SocketHelper.markSocketWithCode(socket, req.params.code, ROLE_CONTROLLER)

        // configure our server side handling
        SocketHelper.configureSocket(socket)

        // connect them
        initiateHandshake(activeGame, socket)
    }

    static debugSockets(req, res, next) {
        res.json(SocketHelper.getClients().map(s => s._meta))
    }
}

module.exports = GameController

/**
 * @param {number} count
 * @returns {string}
 */
function getRandomString(count) {
    let result = ''
    // caps only?
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'//abcdefghijklmnopqrstuvwxyz0123456789'
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
    SocketHelper.markSocketsAsConnected(gameSocket, controllerSocket)

    // send them both a ready event
    let readyMessage = DataMessage.toSend(Types.CONNECTION.READY, {
        // can one day include data here (type of controller configuration?, account details?)
        dummy: "dummy"
    })
    SocketHelper.pushToSocket(controllerSocket, readyMessage)
    SocketHelper.pushToSocket(gameSocket, readyMessage)
}
