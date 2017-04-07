import {ipcRenderer} from 'electron'
var React = require('react')
var ReactDOM = require('react-dom')

class TextArea extends React.Component {
  constructor (props) {
    super(props)
    this.text = 'cc'
    this.state = {
      contents: this.text
    }
  }

  updateText (newText) {

    this.text = newText;
    this.setState({
      contents: null
    })

    ipcRenderer.send('asynchronous-message', this.text)
  }

  handleChange(ev,arg) {
    //console.log(ev, arg)
    this.updateText(arg)
  }

  componentDidMount() {
      ipcRenderer.on('asynchronous-message', this.handleChange.bind(this))
  }

  render () {

    const divStyle = {
      flex: 1,
      position: 'relative',
      outline: 'none',
      height: '100%',
      width: '100%'
    }
    const textareaStyle = {
      flex: 1,
      position: 'relative',
      outline: 'none',
      height: '100%',
      width: '100%',
      resize: 'none'
    }

    return (

      <div style={divStyle} >
        <textarea id='output_field' style={textareaStyle} value={this.state.contents} onChange={this.handleChange.bind(this)} >

        </textarea>
      </div>
    )
  }
}

export default TextArea
