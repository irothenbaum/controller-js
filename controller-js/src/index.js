const GameConnector = require('./connectors/gameConnector')
const ControllerConnector = require('./connectors/controllerConnector')
const EVENTS = require('./events')
const Controllers = require('./controllers')

const React = require('react')
const ReactDOM = require('react-dom')

function InitBasicControllerApp(elementId, connectCode) {
    ReactDOM.render(<Controllers.DefaultGamepad connectCode={connectCode} />, document.getElementById(elementId))
}

module.exports = {
    GameConnector,
    ControllerConnector,
    Controllers,
    EVENTS,
}

// probably not the best way to expose this function in the browser...
window.InitBasicControllerApp = InitBasicControllerApp