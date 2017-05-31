'use strict'

import {ipcRenderer} from 'electron'
var React = require('react')
import fs from 'fs'

export default class TextArea extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      content: this.props.content
    }
    this.handleChange = this.handleChange.bind(this)
  //  this.newLink = this.newLink.bind(this)
  }

  handleChange (ev, arg) {
    this.setState({
      content: ev.target.value
    })
    ipcRenderer.send('asynchronous-message', ev.target.value)
  }

/*  newLink() {
      let index = 0
      let fileName = "./lib/newLink.txt"
      let data = fs.readFileSync(fileName, "utf8")
      let textarea = document.getElementById("output_field");
      index = textarea.selectionStart
      console.log(index)
      this.setState({
        content: this.state.content.slice(0,index) + data + this.state.content.slice(index)
      })
  }*/


  componentDidMount() {
  //  ipcRenderer.on('newLink', this.newLink.bind(this))
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
