const css = require('./JoystickComponent.scss')
const React = require('react')
const PropTypes = require('prop-types')

class JoystickComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isMoving: false
        }

        this.handleStart = this.handleStart.bind(this)
        this.handleEnd = this.handleEnd.bind(this)
        this.handleMove = this.handleMove.bind(this)
    }

    handleMove(evt) {
        if (typeof this.props.onMove === 'function') {
            this.props.onMove()
        }
    }

    handleStart() {
        this.setState({
            isMoving: true
        })

        if (typeof this.props.onStart === 'function') {
            this.props.onStart()
        }
    }

    handleEnd() {
        if (typeof this.props.onEnd === 'function') {
            this.props.onEnd()
        }

        this.setState({
            isMoving: false
        })
    }

    render() {
        return (
            <div
                className={[
                    JoystickComponent.CLASS,
                    (this.state.isMoving ? JoystickComponent.CLASS_MOVE : ''),
                    this.props.className
                ].join(' ')}
                onTouchStart={this.handleStart}
                onTouchMove={this.handleMove}
                onTouchEnd={this.handleEnd}
            >
                <div className={JoystickComponent.CLASS_KNOB}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

JoystickComponent.propTypes = {
    onMove: PropTypes.func.isRequired,
    onStart: PropTypes.func,
    onEnd: PropTypes.func,
}

JoystickComponent.CLASS = 'joystick-component'
JoystickComponent.CLASS_KNOB = 'joystick-knob'
JoystickComponent.CLASS_MOVE = 'is-moving'

module.exports = JoystickComponent