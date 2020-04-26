const css = require('./DefaultGamepad.scss')
const React = require('react')

class DefaultGamepad extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                TEST -- {this.props.connectCode}
            </div>
        )
    }
}

module.exports = DefaultGamepad