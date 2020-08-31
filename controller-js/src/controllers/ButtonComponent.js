const css = require('./ButtonComponent.scss')
const React = require('react')
const PropTypes = require('prop-types')

class ButtonComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isDown: false
        }

        this.handleDown = this.handleDown.bind(this)
        this.handleUp = this.handleUp.bind(this)
    }

    handleDown() {
        this.setState({
            isDown: true
        })

        if (typeof this.props.onDown === 'function') {
            this.props.onDown()
        }
    }

    handleUp() {
        if (typeof this.props.onUp === 'function') {
            this.props.onUp()
        }

        this.setState({
            isDown: false
        })
    }

    render() {
        return (
            <div
                className={[
                    ButtonComponent.CLASS,
                    (this.state.isDown ? ButtonComponent.CLASS_DOWN : ButtonComponent.CLASS_UP),
                    this.props.className
                ].join(' ')}
                onTouchStart={this.handleDown}
                onTouchEnd={this.handleUp}
                // onClick={this.handleDown}
            >
                {this.props.children}
            </div>
        )
    }
}

ButtonComponent.propTypes = {
    onDown: PropTypes.func.isRequired,
    onUp: PropTypes.func
}

ButtonComponent.CLASS = 'button-component'
ButtonComponent.CLASS_DOWN = 'is-down'
ButtonComponent.CLASS_UP = 'is-up'

module.exports = ButtonComponent