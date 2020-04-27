const css = require('./DefaultGamepad.scss')
const React = require('react')
const PropTypes = require('prop-types')
const ControllerConnector = require('../connectors/controllerConnector')
const Events = require('../events')

class DefaultGamepad extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isReady: false,
            handleConnectionReady: this.handleConnectionReady.bind(this)
        }
    }

    componentDidMount() {
        this.__isMounted = true
    }

    componentWillUnmount() {
        this.__isMounted = false
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.connectCode !== prevState.connectCode) {
            if (prevState.connector) {
                prevState.connector.close().then();
            }

            let newConnector = new ControllerConnector()
            newConnector.on(Events.Types.CONNECTION.READY, prevState.handleConnectionReady)

            newConnector.init(nextProps.endpoint, nextProps.connectCode).then()

            return {
                isReady: false,
                connectCode: nextProps.connectCode,
                connector: newConnector
            }
        }
    }

    handleConnectionReady() {
        this.setState({
            isReady: true
        })
    }

    render() {
        return (
            <div>
                {this.state.isReady ? "READY!" : "connecting..."}
            </div>
        )
    }
}

DefaultGamepad.propTypes = {
    connectCode: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired
}

module.exports = DefaultGamepad