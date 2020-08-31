const GameConnector = require('./connectors/GameConnector')
const ControllerConnector = require('./connectors/controllerConnector')
const EVENTS = require('./Events')
const Controllers = require('./controllers')
const HeartbeatSocket = require('./HeartbeatSocket')

const React = require('react')
const ReactDOM = require('react-dom')

/**
 * @param {string} elementId
 * @param {string} connectCode
 * @constructor
 */
function InitBasicControllerApp(elementId, connectCode) {
    const endpoint = window.location.origin.replace('http', 'ws') + `/game/${connectCode}/connect`

    ReactDOM.render(<Controllers.DefaultGamepad endpoint={endpoint} connectCode={connectCode} />, document.getElementById(elementId))
}

const ControllerJS = {
    GameConnector,
    ControllerConnector,
    Controllers,
    EVENTS,
    HeartbeatSocket,
    InitBasicControllerApp,
}

module.exports = ControllerJS

// probably not the best way to expose this function in the browser...
if (window) {
    window.ControllerJS = ControllerJS
}
