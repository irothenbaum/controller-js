const css = require('./DefaultGamepad.scss')
const React = require('react')
const PropTypes = require('prop-types')
const ControllerConnector = require('../connectors/controllerConnector')
const Events = require('../events')
const ButtonComponent = require('./ButtonComponent')

class DefaultGamepad extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isReady: false,
            handleConnectionReady: this.handleConnectionReady.bind(this),
        }

        this.onDown = this.onDown.bind(this)
        this.onUp = this.onUp.bind(this)
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

    onDown(buttonCode) {
        this.state.connector.sendButtonPressDown(buttonCode)
    }

    onUp(buttonCode) {
        this.state.connector.sendButtonPressUp(buttonCode)
    }

    render() {
        return (
            <div>
                <div className="status">
                    {this.state.isReady ? "READY!" : "connecting..."}
                </div>

                <div id="buttons-container">
                    <ButtonComponent className={'red'}
                                     onDown={() => this.onDown('A')}
                                     onUp={() => this.onUp('A')}
                    >
                        A
                    </ButtonComponent>
                    <ButtonComponent
                        className={'blue'}
                        onDown={() => this.onDown('B')}
                        onUp={() => this.onUp('B')}
                    >
                        B
                    </ButtonComponent>
                </div>
            </div>
        )
    }
}

DefaultGamepad.propTypes = {
    connectCode: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired
}

module.exports = DefaultGamepad