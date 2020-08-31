const css = require('./DefaultGamepad.scss')
const React = require('react')
const PropTypes = require('prop-types')
const ControllerConnector = require('../connectors/ControllerConnector')
const Events = require('../Events')
const ButtonComponent = require('./ButtonComponent')
const JoystickComponent = require('./JoystickComponent')

const BUTTONS_AND_COLORS = {
    X: 'blue',
    Y: 'green',
    A: 'red',
    B: 'orange'
}

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

    onMove() {
        this.state.connector.sendJoystickMove()
    }

    render() {
        return (
            <div>
                <div className="status">
                    {this.state.isReady ? "READY!" : "connecting..."}
                </div>

                <div id="buttons-container">
                    <div id="buttons-container-inner">
                        {Object.entries(BUTTONS_AND_COLORS).map(tuple => (
                            <ButtonComponent className={tuple[1]}
                                             onDown={() => this.onDown(tuple[0])}
                                             onUp={() => this.onUp(tuple[0])}
                            >
                                {tuple[0]}
                            </ButtonComponent>
                        ))}
                    </div>
                </div>

                <div id="joystick-container">
                    <div id="joystick-container">
                        <JoystickComponent onMove={() => this.onMove()}>

                        </JoystickComponent>
                    </div>
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