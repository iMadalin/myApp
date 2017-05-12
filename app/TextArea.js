'use strict'

import {ipcRenderer} from 'electron'
var React = require('react')

export default class TextArea extends React.Component {


  constructor (props) {
    super(props)

    this.state = {
      content: this.props.content

    }
    this.handleChange = this.handleChange.bind(this)

  }

  handleChange (ev, arg) {
    this.setState({
      content: ev.target.value
    })
    ipcRenderer.send('asynchronous-message', ev.target.value)
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
