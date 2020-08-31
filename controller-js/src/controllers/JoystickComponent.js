const css = require('./JoystickComponent.scss')
const React = require('react')
const PropTypes = require('prop-types')

class ArticulationVector {
    constructor(d, m) {
        this.direction = d
        this.magnitude = m
    }
}

class JoystickComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isMoving: false,
            isReady: false
        }

        this.handleStart = this.handleStart.bind(this)
        this.handleEnd = this.handleEnd.bind(this)
        this.handleMove = this.handleMove.bind(this)

        this._knobRef = React.createRef();
    }

    componentDidMount() {
        this.setJoystickSurfaceData()
    }

    setJoystickSurfaceData() {
        let surface = this._knobRef.current.parentElement

        this.setState({
            originTop: surface.offsetTop + (surface.offsetHeight / 2),
            originLeft: surface.offsetLeft + (surface.offsetWidth / 2),
            touchSurfaceHeight: surface.offsetHeight,
            touchSurfaceWidth: surface.offsetWidth,
            knobHeight: this._knobRef.current.offsetHeight,
            knobWidth: this._knobRef.current.offsetWidth,
        })
    }

    handleMove(evt) {
        if (evt.changedTouches.length === 0) {
            return
        }
        let touch = evt.changedTouches[0]
        
        let difX = touch.pageX - this.state.originLeft
        let difY = touch.pageY - this.state.originTop
        // this.setKnobPositionFromOriginOffset(difY, difX)
        let vector = this.getVectorFromOriginOffsets(difX, difY)
        this.setKnobPositionFromArticulationVector(vector)

        if (typeof this.props.onMove === 'function') {
            this.props.onMove(vector)
        }
    }

    /**
     * @param {ArticulationVector} vector
     */
    setKnobPositionFromArticulationVector(vector) {
        const MAX_DISTANCE = this.state.touchSurfaceWidth / 2
        let difX = Math.cos(vector.direction) * vector.magnitude * MAX_DISTANCE
        let difY = Math.sin(vector.direction) * vector.magnitude * MAX_DISTANCE

        this.setKnobPositionFromOriginOffset(difX, difY)
    }

    /**
     * @param {number} difX
     * @param {number} difY
     */
    setKnobPositionFromOriginOffset(difX, difY) {
        let transformLeft = difX + (this.state.touchSurfaceWidth / 2)
        let transformTop = difY + (this.state.touchSurfaceHeight / 2)

        this._knobRef.current.style.left = `${transformLeft}px`
        this._knobRef.current.style.top = `${transformTop}px`
    }

    /**
     * @param {number} difX
     * @param {number} difY
     * @returns {ArticulationVector}
     */
    getVectorFromOriginOffsets(difX, difY) {
        const MAX_DISTANCE = this.state.touchSurfaceWidth / 2

        return new ArticulationVector(
            Math.atan2(difY, difX),
            Math.min(MAX_DISTANCE, Math.sqrt(Math.pow(difX, 2) + Math.pow(difY, 2))) / MAX_DISTANCE
        )
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

        // set our knob back to center
        this.setKnobPositionFromOriginOffset(0,0)

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
                <div className={JoystickComponent.CLASS_KNOB}
                     ref={this._knobRef}
                >
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

JoystickComponent.ArticulationVector = ArticulationVector

module.exports = JoystickComponent