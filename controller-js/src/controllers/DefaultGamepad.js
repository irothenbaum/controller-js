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

    /**
     * @param {string} buttonCode
     */
    onDown(buttonCode) {
        this.state.connector.sendButtonPressDown(buttonCode)
    }

    /**
     * @param {string} buttonCode
     */
    onUp(buttonCode) {
        this.state.connector.sendButtonPressUp(buttonCode)
    }

    /**
     * @param {string} joystickCode
     */
    onMoveStart(joystickCode) {
        this.state.connector.sendJoystickMoveStart(joystickCode)
    }

    /**
     * @param {string} joystickCode
     * @param {JoystickComponent.ArticulationVector} vector
     */
    onMove(joystickCode, vector) {
        this.state.connector.sendJoystickMove(joystickCode, vector.direction, vector.magnitude)
    }

    /**
     * @param {string} joystickCode
     */
    onMoveEnd(joystickCode) {
        this.state.connector.sendJoystickMoveEnd(joystickCode)
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
                        <JoystickComponent
                            onMove={(vector) => this.onMove('main', vector)}
                            onStart={() => this.onMoveStart('main')}
                            onEnd={() => this.onMoveEnd('main')}
                        />
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