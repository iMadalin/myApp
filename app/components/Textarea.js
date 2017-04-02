
// import React, { Component, PropTypes } from 'react';
// import Prefixer from 'inline-style-prefixer';
// import { WindowResizeListener } from 'react-window-resize-listener';
// import stylePropType from 'react-style-proptype';
// import $ from 'jquery';
import {ipcRenderer} from 'electron'
var React = require('react')
var ReactDOM = require('react-dom')

class TextArea extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contents: 'sample contents'
    }
  }

  updateContents (ev, arg) {
    console.log('i update')
    this.setState({
      contents: arg
    })
    //this.forceUpdate()
  }

  componentDidMount() {
      ipcRenderer.on('asynchronous-message', this.updateContents.bind(this))
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
        <textarea id='output_field' style={textareaStyle} value={this.state.contents} >

        </textarea>
      </div>
    )
  }
}

export default TextArea
