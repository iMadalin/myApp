'use strict'

import {ipcRenderer} from 'electron'
var React = require('react')

export default class TextArea extends React.Component {
/*   constructor (props) {
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
*/

  constructor (props) {
    super(props)

    this.state = {
      // contents: this.text
      content: this.props.content

    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (ev, arg) {
    // console.log(ev.target.value)
    this.setState({
      content: ev.target.value
    })
    ipcRenderer.send('asynchronous-message', this.state.content)
  }

  componentDidMount () {
    // ipcRenderer.on('asynchronous-message-a', this.handleChange.bind(this))
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
        <textarea id='output_field' style={textareaStyle} value={this.state.content} onChange={this.handleChange.bind(this)} />
      </div>
    )
  }
}
